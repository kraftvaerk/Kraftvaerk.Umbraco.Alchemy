import { html as R, css as B, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT as A } from "@umbraco-cms/backoffice/property-type";
import { o as M, c as N } from "./alchemy-brew.call-api-DciBY2Nb.js";
import { g as _, p as K } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
var q = Object.defineProperty, L = Object.getOwnPropertyDescriptor, T = (e) => {
  throw TypeError(e);
}, U = (e, t, o, c) => {
  for (var r = c > 1 ? void 0 : c ? L(t, o) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (r = (c ? l(t, o, r) : l(r)) || r);
  return c && r && q(t, o, r), r;
}, $ = (e, t, o) => t.has(e) || T("Cannot " + o), D = (e, t, o) => t.has(e) ? T("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, o), w = (e, t, o) => ($(e, t, "access private method"), o), m, P, E;
const g = customElements.get("umb-property-type-workspace-view-settings"), I = g.prototype.render, Y = g.styles ?? [];
let d = class extends g {
  constructor() {
    super(...arguments), D(this, m);
  }
  connectedCallback() {
    var e;
    (e = super.connectedCallback) == null || e.call(this), console.log("[Alchemy] property-type-settings connectedCallback fired"), w(this, m, P).call(this);
  }
  updated() {
    var c, r;
    const e = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#description-input"), t = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#alchemy-brew-btn");
    if (!e || !t) return;
    const o = e.closest("umb-property-layout");
    o && !o.contains(t) && (t.setAttribute("slot", "action-menu"), o.appendChild(t));
  }
  render() {
    return R`
            ${I.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${() => w(this, m, E).call(this)}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }
  static get styles() {
    return [
      ...Y,
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
m = /* @__PURE__ */ new WeakSet();
P = async function() {
  var t, o, c, r, a, l;
  console.log("[Alchemy] #pushContextToCache called");
  const e = _();
  if (console.log("[Alchemy] cacheKey from URL:", e), !!e)
    try {
      const s = await ((t = this.getContext) == null ? void 0 : t.call(this, A));
      console.log("[Alchemy] propWsCtx:", s);
      const i = (o = s == null ? void 0 : s.getData) == null ? void 0 : o.call(s);
      console.log("[Alchemy] propData:", i);
      const n = s == null ? void 0 : s.structure;
      console.log("[Alchemy] workspaceCtx (structure):", n);
      let u = (c = n == null ? void 0 : n.getOwnerContentType) == null ? void 0 : c.call(n);
      if (u || (console.log("[Alchemy] model not ready, awaiting whenLoaded..."), await ((r = n == null ? void 0 : n.whenLoaded) == null ? void 0 : r.call(n)), u = (a = n == null ? void 0 : n.getOwnerContentType) == null ? void 0 : a.call(n)), console.log("[Alchemy] model:", u), !u) {
        console.log("[Alchemy] model is null — aborting cache push");
        return;
      }
      const S = u.containers ?? [], f = new Map(S.map((h) => [h.id, h])), O = (u.properties ?? []).map((h) => {
        var b;
        const p = (b = h.container) != null && b.id ? f.get(h.container.id) : void 0;
        return {
          name: h.name ?? "",
          alias: h.alias ?? "",
          description: h.description ?? null,
          containerName: (p == null ? void 0 : p.name) ?? null,
          containerType: (p == null ? void 0 : p.type) ?? null
        };
      }), y = (l = i == null ? void 0 : i.container) != null && l.id ? f.get(i.container.id) : void 0, v = {
        documentTypeName: u.name ?? "",
        documentTypeDescription: u.description ?? null,
        targetPropertyAlias: (i == null ? void 0 : i.alias) ?? "",
        targetPropertyName: (i == null ? void 0 : i.name) ?? null,
        targetPropertyContainerName: (y == null ? void 0 : y.name) ?? null,
        targetPropertyContainerType: (y == null ? void 0 : y.type) ?? null,
        allProperties: O
      };
      console.log("[Alchemy] pushing context to cache:", { cacheKey: e, context: v }), await K(this, e, v), console.log("[Alchemy] cache push complete");
    } catch (s) {
      console.error("[Alchemy] #pushContextToCache error:", s);
    }
};
E = async function() {
  var l, s, i, n;
  const e = await M(this, {
    prompts: [
      "Write a concise description for this property.",
      "Explain what editors should enter here.",
      "Add a helpful hint for content editors."
    ]
  });
  if (e === void 0) return;
  const t = (l = this.shadowRoot) == null ? void 0 : l.querySelector("#description-input");
  if (!t) return;
  const o = _(), c = await ((s = this.getContext) == null ? void 0 : s.call(this, A)), r = (n = (i = c == null ? void 0 : c.getData) == null ? void 0 : i.call(c)) == null ? void 0 : n.alias, a = await N(this, e, "property-descriptions", o, r);
  a !== void 0 && (t.value = a, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
};
d = U([
  C("umb-alchemy-property-type-settings")
], d);
const z = d;
export {
  d as AlchemyPropertyTypeSettingsElement,
  z as default
};
//# sourceMappingURL=alchemy-property-type-settings.element-Y54Smdik.js.map
