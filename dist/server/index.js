const indexRequest = new Request("https://site.local/index.html");

function withIndexFallback(request) {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return indexRequest;
  }
  return request;
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(withIndexFallback(request));
    if (response.status !== 404) {
      return response;
    }

    const accept = request.headers.get("accept") || "";
    if (accept.includes("text/html")) {
      return env.ASSETS.fetch(indexRequest);
    }

    return response;
  },
};
