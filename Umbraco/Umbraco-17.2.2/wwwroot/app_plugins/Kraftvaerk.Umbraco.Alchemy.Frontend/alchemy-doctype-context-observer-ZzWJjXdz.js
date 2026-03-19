var b = (o) => {
  throw TypeError(o);
};
var u = (o, t, e) => t.has(o) || b("Cannot " + e);
var v = (o, t, e) => (u(o, t, "read from private field"), e ? e.call(o) : t.get(o)), h = (o, t, e) => t.has(o) ? b("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(o) : t.set(o, e), N = (o, t, e, n) => (u(o, t, "write to private field"), n ? n.call(o, e) : t.set(o, e), e), m = (o, t, e) => (u(o, t, "access private method"), e);
import { UmbControllerBase as U } from "@umbraco-cms/backoffice/class-api";
import { UMB_WORKSPACE_CONTEXT as k } from "@umbraco-cms/backoffice/workspace";
import { g as B, p as W } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
var i, c, D, y;
class K extends U {
  constructor(e) {
    super(e);
    h(this, c);
    h(this, i);
    N(this, i, e), console.log("[Alchemy] AlchemyDocTypeContextObserver constructed"), this.consumeContext(k, (n) => {
      console.log("[Alchemy] workspace context resolved:", n), m(this, c, D).call(this, n);
    });
  }
}
i = new WeakMap(), c = new WeakSet(), D = function(e) {
  if (e.unique)
    this.observe(e.unique, (n) => {
      n && m(this, c, y).call(this, e, n);
    });
  else {
    const n = B();
    n && m(this, c, y).call(this, e, n);
  }
}, y = async function(e, n) {
  var s, d, p, g, A, T;
  console.log("[Alchemy] #pushContext, cacheKey:", n);
  try {
    await ((d = (s = e.structure) == null ? void 0 : s.whenLoaded) == null ? void 0 : d.call(s));
    let r = (g = (p = e.structure) == null ? void 0 : p.getOwnerContentType) == null ? void 0 : g.call(p);
    if (console.log("[Alchemy] model:", r), !r) {
      console.log("[Alchemy] model is null — aborting");
      return;
    }
    const E = r.containers ?? [], O = new Map(E.map((l) => [l.id, l])), f = (r.properties ?? []).map((l) => {
      var P;
      const a = (P = l.container) != null && P.id ? O.get(l.container.id) : void 0;
      return {
        name: l.name ?? "",
        alias: l.alias ?? "",
        description: l.description ?? null,
        containerName: (a == null ? void 0 : a.name) ?? null,
        containerType: (a == null ? void 0 : a.type) ?? null
      };
    }), M = {
      documentTypeName: ((A = e.getName) == null ? void 0 : A.call(e)) ?? r.name ?? "",
      documentTypeAlias: r.alias ?? null,
      documentTypeDescription: ((T = e.getDescription) == null ? void 0 : T.call(e)) ?? r.description ?? null,
      isElementType: r.isElement ?? !1,
      targetPropertyAlias: "",
      targetPropertyName: null,
      targetPropertyContainerName: null,
      targetPropertyContainerType: null,
      allProperties: f
    };
    console.log("[Alchemy] pushing context to cache:", { cacheKey: n, properties: f.length }), await W(v(this, i), n, M), console.log("[Alchemy] cache push done");
  } catch (r) {
    console.error("[Alchemy] #pushContext error:", r);
  }
};
export {
  K as AlchemyDocTypeContextObserver,
  K as default
};
//# sourceMappingURL=alchemy-doctype-context-observer-ZzWJjXdz.js.map
