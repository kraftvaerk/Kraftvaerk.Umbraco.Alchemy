var u = (t) => {
  throw TypeError(t);
};
var y = (t, e, o) => e.has(t) || u("Cannot " + o);
var l = (t, e, o) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o);
var d = (t, e, o) => (y(t, e, "access private method"), o);
import { html as m, css as b } from "@umbraco-cms/backoffice/external/lit";
import { o as w, c as f } from "./alchemy-brew.call-api-BJt-gSTw.js";
import { g as v } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
function q(t) {
  var p, h, a;
  const e = t.prototype.render, o = t.styles ?? [];
  return a = class extends t {
    constructor() {
      super(...arguments);
      l(this, p);
    }
    updated() {
      var s, c;
      const n = (s = this.shadowRoot) == null ? void 0 : s.querySelector("#description-input"), r = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#alchemy-brew-btn");
      if (!n || !r) return;
      const i = n.closest("p");
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
                        bottom: 0;
                        right: var(--uui-size-space-1, 2px);
                        z-index: 1;
                    }
                `
      ];
    }
  }, p = new WeakSet(), h = async function() {
    var c;
    const n = await w(this, {
      prompts: [
        "Write a concise description for this property.",
        "Explain what editors should enter here.",
        "Add a helpful hint for content editors."
      ]
    });
    if (n === void 0) return;
    const r = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#description-input");
    if (!r) return;
    const i = v(), s = await f(this, n, "property-descriptions", i);
    s !== void 0 && (r.value = s, r.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, a;
}
export {
  q as createAlchemyDesignEditorPropertyClass
};
//# sourceMappingURL=alchemy-design-editor-property.element-CATDioh_.js.map
