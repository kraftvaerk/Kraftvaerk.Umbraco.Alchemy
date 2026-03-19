import { UMB_AUTH_CONTEXT as u } from "@umbraco-cms/backoffice/auth";
import { p as l } from "./index-3iRATovd.js";
async function f(i, n, a, c, p) {
  var e;
  const t = await i.getContext(u), r = (e = t == null ? void 0 : t.getOpenApiConfiguration) == null ? void 0 : e.call(t), s = typeof (r == null ? void 0 : r.token) == "function" ? await r.token() : r == null ? void 0 : r.token;
  try {
    const { data: o } = await l({
      baseUrl: window.location.origin,
      auth: s,
      body: { prompt: n, contextAlias: a, cacheKey: c, targetPropertyAlias: p }
    });
    return o != null && o.result ? o.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
export {
  f as c
};
//# sourceMappingURL=alchemy-brew.call-api-C2THZJKp.js.map
