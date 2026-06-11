// Newsletter signup receiver. Stores emails in D1 (subscribers table).
// Replaces the former Netlify Forms integration, which does nothing on Cloudflare.
//
// Accepts JSON (from the on-page fetch) or a plain form post (no-JS fallback).
// Binding required: env.DB (D1).

export async function onRequestPost(context) {
  const { request, env } = context;

  const contentType = request.headers.get("content-type") || "";
  let email = "";
  let honeypot = "";

  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      email = String(body.email || "").trim();
      honeypot = String(body["bot-field"] || "").trim();
    } catch {
      return respond(request, false, "invalid json", 400);
    }
  } else {
    const form = await request.formData();
    email = String(form.get("email") || "").trim();
    honeypot = String(form.get("bot-field") || "").trim();
  }

  // Honeypot filled in => almost certainly a bot. Pretend success, store nothing.
  if (honeypot) return respond(request, true, "ok", 200);

  email = email.toLowerCase();
  if (!isValidEmail(email)) {
    return respond(request, false, "invalid email", 400);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO subscribers (email, created_at, source) VALUES (?, ?, ?)
       ON CONFLICT(email) DO NOTHING`
    )
      .bind(email, new Date().toISOString(), "site")
      .run();
  } catch {
    return respond(request, false, "storage failed", 500);
  }

  return respond(request, true, "ok", 200);
}

// Conservative email shape check (defence-in-depth alongside the input type=email).
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

// Fetch callers (Accept: application/json) get JSON; a plain no-JS form post is
// redirected back to the contact section so the user isn't left staring at JSON.
function respond(request, ok, message, status) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("application/json")) {
    const origin = new URL(request.url).origin;
    const target = ok ? "/?subscribed=1#contact" : "/?subscribed=error#contact";
    return new Response(null, { status: 303, headers: { location: origin + target } });
  }
  return new Response(JSON.stringify({ ok, message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}
