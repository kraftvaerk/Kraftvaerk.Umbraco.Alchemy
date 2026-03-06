import { UmbModalToken as p, UMB_MODAL_MANAGER_CONTEXT as s } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT as l } from "@umbraco-cms/backoffice/auth";
import { a as u } from "./sdk.gen-Bhgz5nzZ.js";
const d = new p(
  "alchemy.modal.brew",
  { modal: { type: "dialog" } }
);
async function f(r, a = {}) {
  const n = await r.getContext(s);
  if (n)
    try {
      const o = await n.open(r, d, { data: a }).onSubmit();
      return o == null ? void 0 : o.prompt;
    } catch {
      return;
    }
}
async function M(r, a, n, i) {
  var c;
  const o = await r.getContext(l), t = (c = o == null ? void 0 : o.getOpenApiConfiguration) == null ? void 0 : c.call(o), m = typeof (t == null ? void 0 : t.token) == "function" ? await t.token() : t == null ? void 0 : t.token;
  try {
    const { data: e } = await u({
      baseUrl: window.location.origin,
      auth: m,
      body: { prompt: a, contextAlias: n, cacheKey: i }
    });
    return e != null && e.result ? e.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
export {
  M as c,
  f as o
};
//# sourceMappingURL=alchemy-brew.call-api-DeSbS4X6.js.map
