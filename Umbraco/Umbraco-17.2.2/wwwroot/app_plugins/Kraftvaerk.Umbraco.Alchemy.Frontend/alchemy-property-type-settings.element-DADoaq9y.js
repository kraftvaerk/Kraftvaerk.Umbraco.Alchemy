import { html as M, css as B, customElement as N } from "@umbraco-cms/backoffice/external/lit";
import { UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT as w } from "@umbraco-cms/backoffice/property-type";
import { i as q, a as K, o as $ } from "./alchemy-brew.hold-CI8ek3FG.js";
import { c as D } from "./alchemy-brew.call-api-C3Bu3Kal.js";
import { g as T, p as H } from "./alchemy-brew.collect-property-context-DEp7QA2I.js";
var I = Object.defineProperty, U = Object.getOwnPropertyDescriptor, g = (e) => {
  throw TypeError(e);
}, Y = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? U(t, n) : t, c = e.length - 1, l; c >= 0; c--)
    (l = e[c]) && (i = (r ? l(t, n, i) : l(i)) || i);
  return r && i && I(t, n, i), i;
}, j = (e, t, n) => t.has(e) || g("Cannot " + n), F = (e, t, n) => t.has(e) ? g("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), f = (e, t, n) => (j(e, t, "access private method"), n), p, E, _, S;
const v = customElements.get("umb-property-type-workspace-view-settings"), G = v.prototype.render, L = v.styles ?? [];
let m = class extends v {
  constructor() {
    super(...arguments), F(this, p);
  }
  connectedCallback() {
    var e;
    (e = super.connectedCallback) == null || e.call(this), f(this, p, E).call(this);
  }
  updated() {
    var r, i;
    const e = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#description-input"), t = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#alchemy-brew-btn");
    if (!e || !t) return;
    const n = e.closest("umb-property-layout");
    n && !n.contains(t) && (t.setAttribute("slot", "action-menu"), n.appendChild(t)), this.shadowRoot && q(this.shadowRoot), K(
      t,
      () => f(this, p, _).call(this, m._PROMPTS[0])
    );
  }
  render() {
    return M`
            ${G.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="default"
                compact
                @click=${() => f(this, p, S).call(this)}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
        `;
  }
  static get styles() {
    return [
      ...L,
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
p = /* @__PURE__ */ new WeakSet();
E = async function() {
  var t, n, r, i, c, l;
  const e = T();
  if (e)
    try {
      const s = await ((t = this.getContext) == null ? void 0 : t.call(this, w)), a = (n = s == null ? void 0 : s.getData) == null ? void 0 : n.call(s), o = s == null ? void 0 : s.structure;
      let u = (r = o == null ? void 0 : o.getOwnerContentType) == null ? void 0 : r.call(o);
      if (u || (await ((i = o == null ? void 0 : o.whenLoaded) == null ? void 0 : i.call(o)), u = (c = o == null ? void 0 : o.getOwnerContentType) == null ? void 0 : c.call(o)), !u) return;
      const O = u.containers ?? [], b = new Map(O.map((h) => [h.id, h])), R = (u.properties ?? []).map((h) => {
        var P;
        const d = (P = h.container) != null && P.id ? b.get(h.container.id) : void 0;
        return {
          name: h.name ?? "",
          alias: h.alias ?? "",
          description: h.description ?? null,
          containerName: (d == null ? void 0 : d.name) ?? null,
          containerType: (d == null ? void 0 : d.type) ?? null
        };
      }), y = (l = a == null ? void 0 : a.container) != null && l.id ? b.get(a.container.id) : void 0, A = {
        documentTypeName: u.name ?? "",
        documentTypeDescription: u.description ?? null,
        isElementType: u.isElement ?? !1,
        targetPropertyAlias: (a == null ? void 0 : a.alias) ?? "",
        targetPropertyName: (a == null ? void 0 : a.name) ?? null,
        targetPropertyContainerName: (y == null ? void 0 : y.name) ?? null,
        targetPropertyContainerType: (y == null ? void 0 : y.type) ?? null,
        allProperties: R
      };
      await H(this, e, A);
    } catch (s) {
      console.error("[Alchemy] #pushContextToCache error:", s);
    }
};
_ = async function(e) {
  var l, s, a, o;
  const t = (l = this.shadowRoot) == null ? void 0 : l.querySelector("#description-input");
  if (!t) return;
  const n = T(), r = await ((s = this.getContext) == null ? void 0 : s.call(this, w)), i = (o = (a = r == null ? void 0 : r.getData) == null ? void 0 : a.call(r)) == null ? void 0 : o.alias, c = await D(this, e, "property-descriptions", n, i);
  c !== void 0 && (t.value = c, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
};
S = async function() {
  const e = await $(this, {
    prompts: m._PROMPTS
  });
  e !== void 0 && await f(this, p, _).call(this, e);
};
m._PROMPTS = [
  "Write a concise description for this property.",
  "Explain what editors should enter here.",
  "Add a helpful hint for content editors."
];
m = Y([
  N("umb-alchemy-property-type-settings")
], m);
const V = m;
export {
  m as AlchemyPropertyTypeSettingsElement,
  V as default
};
//# sourceMappingURL=alchemy-property-type-settings.element-DADoaq9y.js.map
