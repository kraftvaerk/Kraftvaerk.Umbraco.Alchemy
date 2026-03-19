import { UMB_AUTH_CONTEXT as p } from "@umbraco-cms/backoffice/auth";
import { a as l } from "./index-CJO75s43.js";
async function f(i, n, a, c, s) {
  var e;
  const t = await i.getContext(p), r = (e = t == null ? void 0 : t.getOpenApiConfiguration) == null ? void 0 : e.call(t), u = typeof (r == null ? void 0 : r.token) == "function" ? await r.token() : r == null ? void 0 : r.token;
  try {
    const { data: o } = await l({
      baseUrl: window.location.origin,
      auth: u,
      body: { prompt: n, contextAlias: a, cacheKey: c, targetPropertyAlias: s }
    });
    return o != null && o.result ? o.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
export {
  f as c
};
//# sourceMappingURL=alchemy-brew.call-api-xNc0KYGJ.js.map
