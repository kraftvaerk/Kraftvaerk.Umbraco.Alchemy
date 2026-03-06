import { UmbModalToken as d, UMB_MODAL_MANAGER_CONTEXT as p } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT as l } from "@umbraco-cms/backoffice/auth";
const m = new d(
  "alchemy.modal.brew",
  { modal: { type: "dialog" } }
);
async function y(o, n = {}) {
  const r = await o.getContext(p);
  if (r)
    try {
      const t = await r.open(o, m, { data: n }).onSubmit();
      return t == null ? void 0 : t.prompt;
    } catch {
      return;
    }
}
async function A(o, n, r, i) {
  var s;
  const t = await o.getContext(l), e = (s = t == null ? void 0 : t.getOpenApiConfiguration) == null ? void 0 : s.call(t);
  let c = {};
  if (e != null && e.token) {
    const a = typeof e.token == "function" ? await e.token() : e.token;
    a && (c = { Authorization: `Bearer ${a}` });
  }
  try {
    const a = await fetch("/api/v1/Kraftvaerk.Umbraco.Alchemy/brew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...c
      },
      credentials: (e == null ? void 0 : e.credentials) ?? "same-origin",
      body: JSON.stringify({ prompt: n, contextAlias: r, cacheKey: i })
    });
    return a.ok ? (await a.json()).result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
export {
  A as c,
  y as o
};
//# sourceMappingURL=alchemy-brew.call-api-DJDCtWmf.js.map
