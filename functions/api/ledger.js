// Public open ledger: running total + list of supporters.
//
// Non-public entries are surfaced as "Anonymous" with no message. CORS is open so the
// same ledger can be embedded on other Good Ship sites by fetching this endpoint.
//
// Returns empty/zero until the webhook is switched out of capture mode and rows land
// in `sponsors`.
//
// Binding required: env.DB (D1 database).

export async function onRequestGet(context) {
  const { env } = context;

  // Running total computed from the rows (never a mutated counter), grouped by currency
  // so a stray non-GBP payment is reported separately rather than silently summed in.
  const totals = await env.DB.prepare(
    `SELECT currency, COUNT(*) AS count, COALESCE(SUM(amount_cents), 0) AS total_cents
       FROM sponsors
   GROUP BY currency`
  ).all();

  const { results: rows } = await env.DB.prepare(
    `SELECT created_at, display_name, amount_cents, currency, is_public, message
       FROM sponsors
   ORDER BY created_at DESC
      LIMIT 200`
  ).all();

  const supporters = rows.map((row) => ({
    name: row.is_public ? row.display_name || "Anonymous" : "Anonymous",
    amount_cents: row.amount_cents,
    currency: row.currency,
    date: row.created_at,
    message: row.is_public ? row.message || null : null,
  }));

  // We expect GBP as the primary currency; fall back gracefully if only others exist.
  const primary =
    totals.results.find((t) => t.currency === "GBP") ||
    totals.results[0] || { currency: "GBP", count: 0, total_cents: 0 };

  return new Response(
    JSON.stringify({
      total_cents: primary.total_cents,
      currency: primary.currency,
      count: primary.count,
      by_currency: totals.results,
      supporters,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=60",
      },
    }
  );
}
