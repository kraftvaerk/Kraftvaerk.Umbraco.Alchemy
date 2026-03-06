import { UMB_AUTH_CONTEXT as p } from "@umbraco-cms/backoffice/auth";
function l() {
  const o = window.location.pathname.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return o == null ? void 0 : o[1];
}
async function f(o, a, s) {
  var i;
  const t = await o.getContext(p), e = (i = t == null ? void 0 : t.getOpenApiConfiguration) == null ? void 0 : i.call(t);
  let c = {};
  if (e != null && e.token) {
    const n = typeof e.token == "function" ? await e.token() : e.token;
    n && (c = { Authorization: `Bearer ${n}` });
  }
  console.log("[Alchemy] pushPropertyContextToCache: fetching brew/context/", a);
  const r = await fetch(`/api/v1/Kraftvaerk.Umbraco.Alchemy/brew/context/${encodeURIComponent(a)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...c },
    credentials: (e == null ? void 0 : e.credentials) ?? "same-origin",
    body: JSON.stringify(s)
  }).catch((n) => (console.error("[Alchemy] pushPropertyContextToCache fetch error:", n), null));
  console.log("[Alchemy] pushPropertyContextToCache response:", r == null ? void 0 : r.status);
}
export {
  l as g,
  f as p
};
//# sourceMappingURL=alchemy-brew.collect-property-context-BC1cQ-xF.js.map
