import { UmbModalToken as s, UMB_MODAL_MANAGER_CONTEXT as l } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT as u } from "@umbraco-cms/backoffice/auth";
import { p as d } from "./sdk.gen-BrMQUxj_.js";
const w = new s(
  "alchemy.modal.brew",
  { modal: { type: "dialog" } }
);
async function M(n, i = {}) {
  const e = await n.getContext(l);
  if (e)
    try {
      const t = await e.open(n, w, { data: i }).onSubmit();
      return t == null ? void 0 : t.prompt;
    } catch {
      return;
    }
}
async function _(n, i, e, c, t) {
  var p;
  const r = await n.getContext(u), o = (p = r == null ? void 0 : r.getOpenApiConfiguration) == null ? void 0 : p.call(r), m = typeof (o == null ? void 0 : o.token) == "function" ? await o.token() : o == null ? void 0 : o.token;
  try {
    const { data: a } = await d({
      baseUrl: window.location.origin,
      auth: m,
      body: { prompt: i, contextAlias: e, cacheKey: c, targetPropertyAlias: t }
    });
    return a != null && a.result ? a.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
export {
  _ as c,
  M as o
};
//# sourceMappingURL=alchemy-brew.call-api-DciBY2Nb.js.map
