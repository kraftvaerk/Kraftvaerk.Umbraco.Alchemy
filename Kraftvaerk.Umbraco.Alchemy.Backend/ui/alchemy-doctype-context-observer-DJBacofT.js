var N = (t) => {
  throw TypeError(t);
};
var u = (t, r, e) => r.has(t) || N("Cannot " + e);
var A = (t, r, e) => (u(t, r, "read from private field"), e ? e.call(t) : r.get(t)), y = (t, r, e) => r.has(t) ? N("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(t) : r.set(t, e), E = (t, r, e, n) => (u(t, r, "write to private field"), n ? n.call(t, e) : r.set(t, e), e), m = (t, r, e) => (u(t, r, "access private method"), e);
import { UmbControllerBase as U } from "@umbraco-cms/backoffice/class-api";
import { UMB_WORKSPACE_CONTEXT as B } from "@umbraco-cms/backoffice/workspace";
import { g as K, p as W } from "./alchemy-brew.collect-property-context-6hUBx9A2.js";
var s, i, b, d;
class G extends U {
  constructor(e) {
    super(e);
    y(this, i);
    y(this, s);
    E(this, s, e), this.consumeContext(B, (n) => {
      m(this, i, b).call(this, n);
    });
  }
}
s = new WeakMap(), i = new WeakSet(), b = function(e) {
  if (e.unique)
    this.observe(e.unique, (n) => {
      n && m(this, i, d).call(this, e, n);
    });
  else {
    const n = K();
    n && m(this, i, d).call(this, e, n);
  }
}, d = async function(e, n) {
  var c, h, p, T, g, f;
  try {
    await ((h = (c = e.structure) == null ? void 0 : c.whenLoaded) == null ? void 0 : h.call(c));
    let o = (T = (p = e.structure) == null ? void 0 : p.getOwnerContentType) == null ? void 0 : T.call(p);
    if (!o) return;
    const v = o.containers ?? [], D = new Map(v.map((a) => [a.id, a])), O = (o.properties ?? []).map((a) => {
      var P;
      const l = (P = a.container) != null && P.id ? D.get(a.container.id) : void 0;
      return {
        name: a.name ?? "",
        alias: a.alias ?? "",
        description: a.description ?? null,
        containerName: (l == null ? void 0 : l.name) ?? null,
        containerType: (l == null ? void 0 : l.type) ?? null
      };
    }), M = {
      documentTypeName: ((g = e.getName) == null ? void 0 : g.call(e)) ?? o.name ?? "",
      documentTypeAlias: o.alias ?? null,
      documentTypeDescription: ((f = e.getDescription) == null ? void 0 : f.call(e)) ?? o.description ?? null,
      isElementType: o.isElement ?? !1,
      targetPropertyAlias: "",
      targetPropertyName: null,
      targetPropertyContainerName: null,
      targetPropertyContainerType: null,
      allProperties: O
    };
    await W(A(this, s), n, M);
  } catch (o) {
    console.error("[Alchemy] #pushContext error:", o);
  }
};
export {
  G as AlchemyDocTypeContextObserver,
  G as default
};
//# sourceMappingURL=alchemy-doctype-context-observer-DJBacofT.js.map
