import { UMB_AUTH_CONTEXT as p } from "@umbraco-cms/backoffice/auth";
import { p as i } from "./sdk.gen-Bhgz5nzZ.js";
function l() {
  const t = window.location.pathname.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return t == null ? void 0 : t[1];
}
async function f(t, n, s) {
  var a;
  const e = await t.getContext(p), o = (a = e == null ? void 0 : e.getOpenApiConfiguration) == null ? void 0 : a.call(e), c = typeof (o == null ? void 0 : o.token) == "function" ? await o.token() : o == null ? void 0 : o.token;
  console.log("[Alchemy] pushPropertyContextToCache: fetching brew/context/", n);
  try {
    const { response: r } = await i({
      baseUrl: window.location.origin,
      auth: c,
      path: { key: n },
      body: s
    });
    console.log("[Alchemy] pushPropertyContextToCache response:", r.status);
  } catch (r) {
    console.error("[Alchemy] pushPropertyContextToCache error:", r);
  }
}
export {
  l as g,
  f as p
};
//# sourceMappingURL=alchemy-brew.collect-property-context-duH_ceg8.js.map
