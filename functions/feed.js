export async function onRequest() {
  const upstream = await fetch("https://tomcw.xyz/rss/", {
    cf: { cacheTtl: 300, cacheEverything: true },
  });

  const headers = new Headers(upstream.headers);
  headers.set("content-type", "application/rss+xml; charset=utf-8");
  headers.set("cache-control", "public, max-age=300");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
