// Drift sponsorship webhook receiver — CAPTURE MODE.
//
// Right now this intentionally stores NOTHING in the ledger. It records the raw
// request (headers + body) to the `raw_captures` table so we can read back the exact
// Drift payload shape — field names, the signature header, the amount format — and
// lock the parser against a real payload before any money moves.
//
// Next phase (once the shape is confirmed): verify signature -> parse -> INSERT into
// `sponsors`, deduping on payment_id so webhook retries can't double-count.
//
// Binding required: env.DB (D1 database).

export async function onRequestPost(context) {
  const { request, env } = context;

  // Collect headers so we can see which one carries Drift's signature.
  const headers = {};
  for (const [key, value] of request.headers) headers[key] = value;

  // Read the raw body verbatim — signature verification (later) must hash the exact bytes.
  const body = await request.text();

  // Capture mode: attempt verification only to LOG whether our guess works; never reject.
  // We don't yet know Drift's signing scheme, so this stays null until a real capture
  // reveals the signature header and algorithm.
  let signatureOk = null;
  if (env.DRIFT_WEBHOOK_SECRET) {
    try {
      signatureOk = (await verifySignature(body, headers, env.DRIFT_WEBHOOK_SECRET)) ? 1 : 0;
    } catch {
      signatureOk = 0;
    }
  }

  try {
    await env.DB.prepare(
      "INSERT INTO raw_captures (received_at, signature_ok, headers, body) VALUES (?, ?, ?, ?)"
    )
      .bind(new Date().toISOString(), signatureOk, JSON.stringify(headers), body)
      .run();
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }

  return json({ ok: true, captured: true }, 200);
}

// Placeholder: we don't yet know Drift's signing scheme (header name, algorithm,
// canonical string). Filled in once a real capture shows us the signature header.
// Kept here so the capture log records a verification result the moment we can.
async function verifySignature(/* body, headers, secret */) {
  return false;
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}
