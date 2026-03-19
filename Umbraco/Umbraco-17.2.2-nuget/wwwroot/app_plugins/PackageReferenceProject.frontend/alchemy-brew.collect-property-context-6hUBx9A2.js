import { UMB_AUTH_CONTEXT as p } from "@umbraco-cms/backoffice/auth";
import { a as s } from "./index-3iRATovd.js";
function m() {
  const t = window.location.pathname.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return t == null ? void 0 : t[1];
}
async function w(t, a, n) {
  var r;
  const e = await t.getContext(p), o = (r = e == null ? void 0 : e.getOpenApiConfiguration) == null ? void 0 : r.call(e), i = typeof (o == null ? void 0 : o.token) == "function" ? await o.token() : o == null ? void 0 : o.token;
  try {
    await s({
      baseUrl: window.location.origin,
      auth: i,
      path: { key: a },
      body: n
    });
  } catch (c) {
    console.error("[Alchemy] pushPropertyContextToCache error:", c);
  }
}
export {
  m as g,
  w as p
};
//# sourceMappingURL=alchemy-brew.collect-property-context-6hUBx9A2.js.map
