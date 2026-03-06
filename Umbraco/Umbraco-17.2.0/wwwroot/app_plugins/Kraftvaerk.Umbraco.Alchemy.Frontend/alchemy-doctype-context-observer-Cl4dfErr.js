var N = (o) => {
  throw TypeError(o);
};
var u = (o, t, e) => t.has(o) || N("Cannot " + e);
var O = (o, t, e) => (u(o, t, "read from private field"), e ? e.call(o) : t.get(o)), y = (o, t, e) => t.has(o) ? N("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(o) : t.set(o, e), D = (o, t, e, n) => (u(o, t, "write to private field"), n ? n.call(o, e) : t.set(o, e), e), b = (o, t, e) => (u(o, t, "access private method"), e);
import { UmbControllerBase as U } from "@umbraco-cms/backoffice/class-api";
import { UMB_WORKSPACE_CONTEXT as B } from "@umbraco-cms/backoffice/workspace";
import { g as C, p as L } from "./alchemy-brew.collect-property-context-BC1cQ-xF.js";
var a, m, v;
class R extends U {
  constructor(e) {
    super(e);
    y(this, m);
    y(this, a);
    D(this, a, e), console.log("[Alchemy] AlchemyDocTypeContextObserver constructed"), this.consumeContext(B, (n) => {
      console.log("[Alchemy] workspace context resolved:", n), b(this, m, v).call(this, n);
    });
  }
}
a = new WeakMap(), m = new WeakSet(), v = async function(e) {
  var i, h, s, d, p, g, A, T;
  const n = C();
  if (console.log("[Alchemy] #pushContext, cacheKey:", n), !!n)
    try {
      let r = (h = (i = e.structure) == null ? void 0 : i.getOwnerContentType) == null ? void 0 : h.call(i);
      if (r || (console.log("[Alchemy] model not ready, awaiting whenLoaded..."), await ((d = (s = e.structure) == null ? void 0 : s.whenLoaded) == null ? void 0 : d.call(s)), r = (g = (p = e.structure) == null ? void 0 : p.getOwnerContentType) == null ? void 0 : g.call(p)), console.log("[Alchemy] model:", r), !r) {
        console.log("[Alchemy] model is null — aborting");
        return;
      }
      const E = r.containers ?? [], K = new Map(E.map((c) => [c.id, c])), f = (r.properties ?? []).map((c) => {
        var P;
        const l = (P = c.container) != null && P.id ? K.get(c.container.id) : void 0;
        return {
          name: c.name ?? "",
          alias: c.alias ?? "",
          description: c.description ?? null,
          containerName: (l == null ? void 0 : l.name) ?? null,
          containerType: (l == null ? void 0 : l.type) ?? null
        };
      }), M = {
        documentTypeName: ((A = e.getName) == null ? void 0 : A.call(e)) ?? r.name ?? "",
        documentTypeDescription: ((T = e.getDescription) == null ? void 0 : T.call(e)) ?? r.description ?? null,
        targetPropertyAlias: "",
        targetPropertyName: null,
        targetPropertyContainerName: null,
        targetPropertyContainerType: null,
        allProperties: f
      };
      console.log("[Alchemy] pushing context to cache:", { cacheKey: n, properties: f.length }), await L(O(this, a), n, M), console.log("[Alchemy] cache push done");
    } catch (r) {
      console.error("[Alchemy] #pushContext error:", r);
    }
};
export {
  R as AlchemyDocTypeContextObserver,
  R as default
};
//# sourceMappingURL=alchemy-doctype-context-observer-Cl4dfErr.js.map
