var d = (n) => {
  throw TypeError(n);
};
var u = (n, r, e) => r.has(n) || d("Cannot " + e);
var g = (n, r, e) => (u(n, r, "read from private field"), e ? e.call(n) : r.get(n)), T = (n, r, e) => r.has(n) ? d("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(n) : r.set(n, e), f = (n, r, e, o) => (u(n, r, "write to private field"), o ? o.call(n, e) : r.set(n, e), e), h = (n, r, e) => (u(n, r, "access private method"), e);
import { UmbControllerBase as B } from "@umbraco-cms/backoffice/class-api";
import { UMB_WORKSPACE_CONTEXT as E } from "@umbraco-cms/backoffice/workspace";
import { UMB_AUTH_CONTEXT as b } from "@umbraco-cms/backoffice/auth";
import { p as K } from "./index-U2tSj8bb.js";
var p, l, N, U;
class q extends B {
  constructor(e) {
    super(e);
    T(this, l);
    T(this, p);
    this.consumeContext(b, (o) => {
      var s;
      const t = (s = o == null ? void 0 : o.getOpenApiConfiguration) == null ? void 0 : s.call(o);
      typeof (t == null ? void 0 : t.token) == "function" ? t.token().then((c) => {
        f(this, p, c);
      }) : f(this, p, t == null ? void 0 : t.token);
    }), this.consumeContext(E, (o) => {
      h(this, l, N).call(this, o);
    });
  }
}
p = new WeakMap(), l = new WeakSet(), N = function(e) {
  const o = e.structure;
  o && o.ownerContentType && this.observe(
    o.ownerContentType,
    (t) => {
      var c;
      if (!t) return;
      const s = (c = e.getUnique) == null ? void 0 : c.call(e);
      s && h(this, l, U).call(this, e, s, t);
    },
    "alchemy-owner-ct"
  );
}, U = async function(e, o, t) {
  var s, c, k;
  try {
    const y = t.containers ?? [], O = new Map(y.map((i) => [i.id, i])), P = (t.properties ?? []).map((i) => {
      var A;
      const a = (A = i.container) != null && A.id ? O.get(i.container.id) : void 0;
      return {
        name: i.name ?? "",
        alias: i.alias ?? "",
        description: i.description ?? null,
        containerName: (a == null ? void 0 : a.name) ?? null,
        containerType: (a == null ? void 0 : a.type) ?? null
      };
    }), v = {
      documentTypeName: ((s = e.getName) == null ? void 0 : s.call(e)) ?? t.name ?? "",
      documentTypeAlias: t.alias ?? null,
      documentTypeDescription: ((c = e.getDescription) == null ? void 0 : c.call(e)) ?? t.description ?? null,
      isElementType: t.isElement ?? !1,
      targetPropertyAlias: "",
      targetPropertyName: null,
      targetPropertyContainerName: null,
      targetPropertyContainerType: null,
      allProperties: P
    };
    let m = g(this, p);
    if (!m)
      try {
        const i = await this.getContext(b), a = (k = i == null ? void 0 : i.getOpenApiConfiguration) == null ? void 0 : k.call(i);
        m = typeof (a == null ? void 0 : a.token) == "function" ? await a.token() : a == null ? void 0 : a.token;
      } catch {
      }
    await K({
      baseUrl: window.location.origin,
      auth: m,
      path: { key: o },
      body: v
    });
  } catch (y) {
    console.error("[Alchemy] #pushContext error:", y);
  }
};
export {
  q as AlchemyDocTypeContextObserver,
  q as default
};
//# sourceMappingURL=alchemy-doctype-context-observer-BK2eqO69.js.map
