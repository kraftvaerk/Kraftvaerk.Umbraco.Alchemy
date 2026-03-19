var N = (o) => {
  throw TypeError(o);
};
var h = (o, t, e) => t.has(o) || N("Cannot " + e);
var O = (o, t, e) => (h(o, t, "read from private field"), e ? e.call(o) : t.get(o)), y = (o, t, e) => t.has(o) ? N("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(o) : t.set(o, e), D = (o, t, e, n) => (h(o, t, "write to private field"), n ? n.call(o, e) : t.set(o, e), e), u = (o, t, e) => (h(o, t, "access private method"), e);
import { UmbControllerBase as B } from "@umbraco-cms/backoffice/class-api";
import { UMB_WORKSPACE_CONTEXT as L } from "@umbraco-cms/backoffice/workspace";
import { g as W, p as _ } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
var i, c, E, d;
class R extends B {
  constructor(e) {
    super(e);
    y(this, c);
    y(this, i);
    D(this, i, e), console.log("[Alchemy] AlchemyDocTypeContextObserver constructed"), this.consumeContext(L, (n) => {
      console.log("[Alchemy] workspace context resolved:", n), u(this, c, E).call(this, n);
    });
  }
}
i = new WeakMap(), c = new WeakSet(), E = function(e) {
  if (e.unique)
    this.observe(e.unique, (n) => {
      n && u(this, c, d).call(this, e, n);
    });
  else {
    const n = W();
    n && u(this, c, d).call(this, e, n);
  }
}, d = async function(e, n) {
  var s, g, p, A, m, T, f, P;
  console.log("[Alchemy] #pushContext, cacheKey:", n);
  try {
    let r = (g = (s = e.structure) == null ? void 0 : s.getOwnerContentType) == null ? void 0 : g.call(s);
    if (r || (console.log("[Alchemy] model not ready, awaiting whenLoaded..."), await ((A = (p = e.structure) == null ? void 0 : p.whenLoaded) == null ? void 0 : A.call(p)), r = (T = (m = e.structure) == null ? void 0 : m.getOwnerContentType) == null ? void 0 : T.call(m)), console.log("[Alchemy] model:", r), !r) {
      console.log("[Alchemy] model is null — aborting");
      return;
    }
    const M = r.containers ?? [], U = new Map(M.map((l) => [l.id, l])), b = (r.properties ?? []).map((l) => {
      var v;
      const a = (v = l.container) != null && v.id ? U.get(l.container.id) : void 0;
      return {
        name: l.name ?? "",
        alias: l.alias ?? "",
        description: l.description ?? null,
        containerName: (a == null ? void 0 : a.name) ?? null,
        containerType: (a == null ? void 0 : a.type) ?? null
      };
    }), k = {
      documentTypeName: ((f = e.getName) == null ? void 0 : f.call(e)) ?? r.name ?? "",
      documentTypeDescription: ((P = e.getDescription) == null ? void 0 : P.call(e)) ?? r.description ?? null,
      isElementType: r.isElement ?? !1,
      targetPropertyAlias: "",
      targetPropertyName: null,
      targetPropertyContainerName: null,
      targetPropertyContainerType: null,
      allProperties: b
    };
    console.log("[Alchemy] pushing context to cache:", { cacheKey: n, properties: b.length }), await _(O(this, i), n, k), console.log("[Alchemy] cache push done");
  } catch (r) {
    console.error("[Alchemy] #pushContext error:", r);
  }
};
export {
  R as AlchemyDocTypeContextObserver,
  R as default
};
//# sourceMappingURL=alchemy-doctype-context-observer-Ddr9nyPB.js.map
