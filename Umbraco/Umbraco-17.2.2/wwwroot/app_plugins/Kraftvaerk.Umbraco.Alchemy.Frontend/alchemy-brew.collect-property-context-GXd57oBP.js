import { UMB_AUTH_CONTEXT as c } from "@umbraco-cms/backoffice/auth";
import { p as s } from "./index-DFBjOYvX.js";
function m() {
  const t = window.location.pathname.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return t == null ? void 0 : t[1];
}
async function w(t, a, n) {
  var r;
  const e = await t.getContext(c), o = (r = e == null ? void 0 : e.getOpenApiConfiguration) == null ? void 0 : r.call(e), i = typeof (o == null ? void 0 : o.token) == "function" ? await o.token() : o == null ? void 0 : o.token;
  try {
    await s({
      baseUrl: window.location.origin,
      auth: i,
      path: { key: a },
      body: n
    });
  } catch (p) {
    console.error("[Alchemy] pushPropertyContextToCache error:", p);
  }
}
export {
  m as g,
  w as p
};
//# sourceMappingURL=alchemy-brew.collect-property-context-GXd57oBP.js.map
