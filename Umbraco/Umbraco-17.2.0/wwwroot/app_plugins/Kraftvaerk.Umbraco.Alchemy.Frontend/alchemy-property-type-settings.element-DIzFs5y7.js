import { html as M, css as B, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT as P } from "@umbraco-cms/backoffice/property-type";
import { i as N, a as K, c as q, o as D } from "./alchemy-brew.hold-BQupQRTz.js";
import { g as A, p as L } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
var U = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, T = (e) => {
  throw TypeError(e);
}, H = (e, t, n, c) => {
  for (var s = c > 1 ? void 0 : c ? $(t, n) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (s = (c ? l(t, n, s) : l(s)) || s);
  return c && s && U(t, n, s), s;
}, I = (e, t, n) => t.has(e) || T("Cannot " + n), Y = (e, t, n) => t.has(e) ? T("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), g = (e, t, n) => (I(e, t, "access private method"), n), d, E, f, S;
const w = customElements.get("umb-property-type-workspace-view-settings"), j = w.prototype.render, F = w.styles ?? [];
let m = class extends w {
  constructor() {
    super(...arguments), Y(this, d);
  }
  connectedCallback() {
    var e;
    (e = super.connectedCallback) == null || e.call(this), console.log("[Alchemy] property-type-settings connectedCallback fired"), g(this, d, E).call(this);
  }
  updated() {
    var c, s;
    const e = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#description-input"), t = (s = this.shadowRoot) == null ? void 0 : s.querySelector("#alchemy-brew-btn");
    if (!e || !t) return;
    const n = e.closest("umb-property-layout");
    n && !n.contains(t) && (t.setAttribute("slot", "action-menu"), n.appendChild(t)), this.shadowRoot && N(this.shadowRoot), K(
      t,
      () => g(this, d, f).call(this, m._PROMPTS[0])
    );
  }
  render() {
    return M`
            ${j.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${() => g(this, d, S).call(this)}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }
  static get styles() {
    return [
      ...F,
      B`
                #alchemy-brew-btn {
                    opacity: 0.4;
                    transition: opacity 120ms;
                }
                #alchemy-brew-btn:hover {
                    opacity: 1;
                }
            `
    ];
  }
};
d = /* @__PURE__ */ new WeakSet();
E = async function() {
  var t, n, c, s, a, l;
  console.log("[Alchemy] #pushContextToCache called");
  const e = A();
  if (console.log("[Alchemy] cacheKey from URL:", e), !!e)
    try {
      const r = await ((t = this.getContext) == null ? void 0 : t.call(this, P));
      console.log("[Alchemy] propWsCtx:", r);
      const i = (n = r == null ? void 0 : r.getData) == null ? void 0 : n.call(r);
      console.log("[Alchemy] propData:", i);
      const o = r == null ? void 0 : r.structure;
      console.log("[Alchemy] workspaceCtx (structure):", o);
      let h = (c = o == null ? void 0 : o.getOwnerContentType) == null ? void 0 : c.call(o);
      if (h || (console.log("[Alchemy] model not ready, awaiting whenLoaded..."), await ((s = o == null ? void 0 : o.whenLoaded) == null ? void 0 : s.call(o)), h = (a = o == null ? void 0 : o.getOwnerContentType) == null ? void 0 : a.call(o)), console.log("[Alchemy] model:", h), !h) {
        console.log("[Alchemy] model is null — aborting cache push");
        return;
      }
      const R = h.containers ?? [], _ = new Map(R.map((u) => [u.id, u])), O = (h.properties ?? []).map((u) => {
        var b;
        const p = (b = u.container) != null && b.id ? _.get(u.container.id) : void 0;
        return {
          name: u.name ?? "",
          alias: u.alias ?? "",
          description: u.description ?? null,
          containerName: (p == null ? void 0 : p.name) ?? null,
          containerType: (p == null ? void 0 : p.type) ?? null
        };
      }), y = (l = i == null ? void 0 : i.container) != null && l.id ? _.get(i.container.id) : void 0, v = {
        documentTypeName: h.name ?? "",
        documentTypeDescription: h.description ?? null,
        targetPropertyAlias: (i == null ? void 0 : i.alias) ?? "",
        targetPropertyName: (i == null ? void 0 : i.name) ?? null,
        targetPropertyContainerName: (y == null ? void 0 : y.name) ?? null,
        targetPropertyContainerType: (y == null ? void 0 : y.type) ?? null,
        allProperties: O
      };
      console.log("[Alchemy] pushing context to cache:", { cacheKey: e, context: v }), await L(this, e, v), console.log("[Alchemy] cache push complete");
    } catch (r) {
      console.error("[Alchemy] #pushContextToCache error:", r);
    }
};
f = async function(e) {
  var l, r, i, o;
  const t = (l = this.shadowRoot) == null ? void 0 : l.querySelector("#description-input");
  if (!t) return;
  const n = A(), c = await ((r = this.getContext) == null ? void 0 : r.call(this, P)), s = (o = (i = c == null ? void 0 : c.getData) == null ? void 0 : i.call(c)) == null ? void 0 : o.alias, a = await q(this, e, "property-descriptions", n, s);
  a !== void 0 && (t.value = a, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
};
S = async function() {
  const e = await D(this, {
    prompts: m._PROMPTS
  });
  e !== void 0 && await g(this, d, f).call(this, e);
};
m._PROMPTS = [
  "Write a concise description for this property.",
  "Explain what editors should enter here.",
  "Add a helpful hint for content editors."
];
m = H([
  C("umb-alchemy-property-type-settings")
], m);
const Q = m;
export {
  m as AlchemyPropertyTypeSettingsElement,
  Q as default
};
//# sourceMappingURL=alchemy-property-type-settings.element-DIzFs5y7.js.map
