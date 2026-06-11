// Token-protected export of newsletter subscribers.
//
//   GET /api/subscribers?token=<DEBUG_TOKEN>                 -> CSV download
//   GET /api/subscribers?token=<DEBUG_TOKEN>&format=json     -> JSON
//
// Protected because the list is PII (emails). Bindings required: env.DB (D1),
// env.DEBUG_TOKEN.

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!env.DEBUG_TOKEN || token !== env.DEBUG_TOKEN) {
    return new Response("Forbidden", { status: 403 });
  }

  const { results } = await env.DB.prepare(
    "SELECT email, created_at, source FROM subscribers ORDER BY created_at DESC"
  ).all();

  if (url.searchParams.get("format") === "json") {
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const rows = results.map((row) =>
    [row.email, row.created_at, row.source].map(csvCell).join(",")
  );
  const csv = ["email,created_at,source", ...rows].join("\r\n") + "\r\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}

// RFC 4180 quoting + spreadsheet formula-injection guard.
function csvCell(value) {
  let str = value == null ? "" : String(value);
  // A leading =, +, -, @ (or control char) can be executed as a formula in Excel/Sheets.
  if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
  if (/[",\r\n]/.test(str)) str = '"' + str.replace(/"/g, '""') + '"';
  return str;
}
