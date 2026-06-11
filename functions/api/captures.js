// Debug endpoint: read back recently captured raw webhook payloads so we can inspect
// the Drift shape without watching live logs. Token-protected because raw captures may
// contain PII.
//
//   GET /api/captures?token=THE_DEBUG_TOKEN
//
// Bindings required: env.DB (D1), env.DEBUG_TOKEN (any random string).

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!env.DEBUG_TOKEN || token !== env.DEBUG_TOKEN) {
    return new Response("Forbidden", { status: 403 });
  }

  const { results } = await env.DB.prepare(
    `SELECT id, received_at, signature_ok, headers, body
       FROM raw_captures
   ORDER BY id DESC
      LIMIT 20`
  ).all();

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
