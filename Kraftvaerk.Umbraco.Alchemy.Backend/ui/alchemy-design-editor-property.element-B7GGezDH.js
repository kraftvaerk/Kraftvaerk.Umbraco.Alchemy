var u = (t) => {
  throw TypeError(t);
};
var y = (t, e, o) => e.has(t) || u("Cannot " + o);
var l = (t, e, o) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o);
var d = (t, e, o) => (y(t, e, "access private method"), o);
import { html as m, css as b } from "@umbraco-cms/backoffice/external/lit";
import { o as w, c as f } from "./alchemy-brew.call-api-DeSbS4X6.js";
import { g as v } from "./alchemy-brew.collect-property-context-duH_ceg8.js";
function q(t) {
  var p, h, a;
  const e = t.prototype.render, o = t.styles ?? [];
  return a = class extends t {
    constructor() {
      super(...arguments);
      l(this, p);
    }
    updated() {
      var n, c;
      const s = (n = this.shadowRoot) == null ? void 0 : n.querySelector("#description-input"), r = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#alchemy-brew-btn");
      if (!s || !r) return;
      const i = s.closest("p");
      i && !i.contains(r) && (i.style.position = "relative", i.appendChild(r));
    }
    render() {
      return m`
                ${e.call(this)}
                <uui-button
                    id="alchemy-brew-btn"
                    label="Brew description"
                    look="secondary"
                    compact
                    @click=${() => d(this, p, h).call(this)}>
                    <uui-icon name="icon-wand"></uui-icon>
                </uui-button>
            `;
    }
    static get styles() {
      return [
        ...o,
        b`
                    #alchemy-brew-btn {
                        position: absolute;
                        top: var(--uui-size-space-1, 2px);
                        right: var(--uui-size-space-1, 2px);
                        z-index: 1;
                    }
                `
      ];
    }
  }, p = new WeakSet(), h = async function() {
    var c;
    const s = await w(this, {
      prompts: [
        "Write a concise description for this property.",
        "Explain what editors should enter here.",
        "Add a helpful hint for content editors."
      ]
    });
    if (s === void 0) return;
    const r = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#description-input");
    if (!r) return;
    const i = v(), n = await f(this, s, "property-descriptions", i);
    n !== void 0 && (r.value = n, r.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, a;
}
export {
  q as createAlchemyDesignEditorPropertyClass
};
//# sourceMappingURL=alchemy-design-editor-property.element-B7GGezDH.js.map
