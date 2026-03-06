import { html as O, css as R, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT as B } from "@umbraco-cms/backoffice/property-type";
import { o as M, c as N } from "./alchemy-brew.call-api-DJDCtWmf.js";
import { g as w, p as K } from "./alchemy-brew.collect-property-context-BC1cQ-xF.js";
var q = Object.defineProperty, L = Object.getOwnPropertyDescriptor, A = (e) => {
  throw TypeError(e);
}, U = (e, t, n, c) => {
  for (var o = c > 1 ? void 0 : c ? L(t, n) : t, u = e.length - 1, h; u >= 0; u--)
    (h = e[u]) && (o = (c ? h(t, n, o) : h(o)) || o);
  return c && o && q(t, n, o), o;
}, $ = (e, t, n) => t.has(e) || A("Cannot " + n), I = (e, t, n) => t.has(e) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), _ = (e, t, n) => ($(e, t, "access private method"), n), m, T, P;
const g = customElements.get("umb-property-type-workspace-view-settings"), Y = g.prototype.render, D = g.styles ?? [];
let d = class extends g {
  constructor() {
    super(...arguments), I(this, m);
  }
  connectedCallback() {
    var e;
    (e = super.connectedCallback) == null || e.call(this), console.log("[Alchemy] property-type-settings connectedCallback fired"), _(this, m, T).call(this);
  }
  updated() {
    var c, o;
    const e = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#description-input"), t = (o = this.shadowRoot) == null ? void 0 : o.querySelector("#alchemy-brew-btn");
    if (!e || !t) return;
    const n = e.closest("umb-property-layout");
    n && !n.contains(t) && (t.setAttribute("slot", "action-menu"), n.appendChild(t));
  }
  render() {
    return O`
            ${Y.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${() => _(this, m, P).call(this)}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }
  static get styles() {
    return [
      ...D,
      R`
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
m = /* @__PURE__ */ new WeakSet();
T = async function() {
  var t, n, c, o, u, h;
  console.log("[Alchemy] #pushContextToCache called");
  const e = w();
  if (console.log("[Alchemy] cacheKey from URL:", e), !!e)
    try {
      const s = await ((t = this.getContext) == null ? void 0 : t.call(this, B));
      console.log("[Alchemy] propWsCtx:", s);
      const i = (n = s == null ? void 0 : s.getData) == null ? void 0 : n.call(s);
      console.log("[Alchemy] propData:", i);
      const r = s == null ? void 0 : s.structure;
      console.log("[Alchemy] workspaceCtx (structure):", r);
      let l = (c = r == null ? void 0 : r.getOwnerContentType) == null ? void 0 : c.call(r);
      if (l || (console.log("[Alchemy] model not ready, awaiting whenLoaded..."), await ((o = r == null ? void 0 : r.whenLoaded) == null ? void 0 : o.call(r)), l = (u = r == null ? void 0 : r.getOwnerContentType) == null ? void 0 : u.call(r)), console.log("[Alchemy] model:", l), !l) {
        console.log("[Alchemy] model is null — aborting cache push");
        return;
      }
      const E = l.containers ?? [], f = new Map(E.map((a) => [a.id, a])), S = (l.properties ?? []).map((a) => {
        var b;
        const y = (b = a.container) != null && b.id ? f.get(a.container.id) : void 0;
        return {
          name: a.name ?? "",
          alias: a.alias ?? "",
          description: a.description ?? null,
          containerName: (y == null ? void 0 : y.name) ?? null,
          containerType: (y == null ? void 0 : y.type) ?? null
        };
      }), p = (h = i == null ? void 0 : i.container) != null && h.id ? f.get(i.container.id) : void 0, v = {
        documentTypeName: l.name ?? "",
        documentTypeDescription: l.description ?? null,
        targetPropertyAlias: (i == null ? void 0 : i.alias) ?? "",
        targetPropertyName: (i == null ? void 0 : i.name) ?? null,
        targetPropertyContainerName: (p == null ? void 0 : p.name) ?? null,
        targetPropertyContainerType: (p == null ? void 0 : p.type) ?? null,
        allProperties: S
      };
      console.log("[Alchemy] pushing context to cache:", { cacheKey: e, context: v }), await K(this, e, v), console.log("[Alchemy] cache push complete");
    } catch (s) {
      console.error("[Alchemy] #pushContextToCache error:", s);
    }
};
P = async function() {
  var o;
  const e = await M(this, {
    prompts: [
      "Write a concise description for this property.",
      "Explain what editors should enter here.",
      "Add a helpful hint for content editors."
    ]
  });
  if (e === void 0) return;
  const t = (o = this.shadowRoot) == null ? void 0 : o.querySelector("#description-input");
  if (!t) return;
  const n = w(), c = await N(this, e, "property-descriptions", n);
  c !== void 0 && (t.value = c, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
};
d = U([
  C("umb-alchemy-property-type-settings")
], d);
const z = d;
export {
  d as AlchemyPropertyTypeSettingsElement,
  z as default
};
//# sourceMappingURL=alchemy-property-type-settings.element-hUWK56ou.js.map
