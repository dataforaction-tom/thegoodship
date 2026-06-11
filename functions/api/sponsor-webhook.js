// Drift sponsorship webhook receiver — PRODUCTION MODE.
//
// Flow: authenticate -> parse -> idempotent insert into `sponsors`.
//
// Auth: a shared secret sent by Drift in the `X-Webhook-Token` custom header, compared
// constant-time against env.WEBHOOK_TOKEN. This stops anyone who discovers the URL from
// injecting fake ledger entries. (HMAC signature verification can be layered on later
// once we capture a request signed with Drift's signing secret — see verifySignature.)
//
// Bindings required: env.DB (D1), env.WEBHOOK_TOKEN (shared secret).

import { parseSubmission } from "../../lib/parse-submission.mjs";

export async function onRequestPost(context) {
  const { request, env } = context;

  const provided = request.headers.get("x-webhook-token") || "";
  if (!env.WEBHOOK_TOKEN || !timingSafeEqual(provided, env.WEBHOOK_TOKEN)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const bodyText = await request.text();
  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return json({ ok: false, error: "invalid json" }, 400);
  }

  const parsed = parseSubmission(payload);
  if (!parsed.ok) {
    // Record anything we deliberately ignore (e.g. status != succeeded) or can't parse,
    // so we can debug it later via /api/captures. Return 200 so Drift does not retry a
    // payload we've intentionally dropped.
    await logCapture(env, request, bodyText, parsed.reason);
    return json({ ok: true, stored: false, reason: parsed.reason }, 200);
  }

  const row = parsed.row;
  try {
    await env.DB.prepare(
      `INSERT INTO sponsors
         (payment_id, stripe_payment_intent_id, created_at, display_name, amount_cents, currency, is_public, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(payment_id) DO NOTHING`
    )
      .bind(
        row.submissionId,
        row.stripePaymentIntentId,
        row.createdAt,
        row.displayName,
        row.amountMinor,
        row.currency,
        row.isPublic,
        row.message
      )
      .run();
  } catch (err) {
    await logCapture(env, request, bodyText, "db error: " + String(err));
    return json({ ok: false, error: "storage failed" }, 500);
  }

  return json({ ok: true, stored: true }, 200);
}

// Constant-time string comparison so the token check doesn't leak via timing.
// (Length is allowed to differ early — the token is high-entropy, so length isn't secret.)
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// Best-effort debug capture of payloads we couldn't store, reusing the raw_captures table.
async function logCapture(env, request, body, reason) {
  try {
    const headers = {};
    for (const [key, value] of request.headers) headers[key] = value;
    await env.DB.prepare(
      "INSERT INTO raw_captures (received_at, signature_ok, headers, body) VALUES (?, ?, ?, ?)"
    )
      .bind(new Date().toISOString(), null, JSON.stringify({ reason, headers }), body)
      .run();
  } catch {
    // Logging is best-effort; never let it mask the real response.
  }
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}
