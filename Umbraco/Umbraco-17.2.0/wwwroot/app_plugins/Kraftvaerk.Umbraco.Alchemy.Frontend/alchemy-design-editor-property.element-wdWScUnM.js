var d = (t) => {
  throw TypeError(t);
};
var b = (t, e, o) => e.has(t) || d("Cannot " + o);
var h = (t, e, o) => e.has(t) ? d("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o);
var y = (t, e, o) => (b(t, e, "access private method"), o);
import { html as w, css as f } from "@umbraco-cms/backoffice/external/lit";
import { o as v, c as g } from "./alchemy-brew.call-api-DciBY2Nb.js";
import { g as E } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
function D(t) {
  var c, m, a;
  const e = t.prototype.render, o = t.styles ?? [];
  return a = class extends t {
    constructor() {
      super(...arguments);
      h(this, c);
    }
    updated() {
      var p, n;
      const s = (p = this.shadowRoot) == null ? void 0 : p.querySelector("#description-input"), r = (n = this.shadowRoot) == null ? void 0 : n.querySelector("#alchemy-brew-btn");
      if (!s || !r) return;
      const i = s.closest("p");
      i && !i.contains(r) && (i.style.position = "relative", i.appendChild(r));
    }
    render() {
      return w`
                ${e.call(this)}
                <uui-button
                    id="alchemy-brew-btn"
                    label="Brew description"
                    look="secondary"
                    compact
                    @click=${() => y(this, c, m).call(this)}>
                    <uui-icon name="icon-wand"></uui-icon>
                </uui-button>
            `;
    }
    static get styles() {
      return [
        ...o,
        f`
                    #alchemy-brew-btn {
                        position: absolute;
                        bottom: 0;
                        right: var(--uui-size-space-1, 2px);
                        z-index: 1;
                    }
                `
      ];
    }
  }, c = new WeakSet(), m = async function() {
    var l, u;
    const s = await v(this, {
      prompts: [
        "Write a concise description for this property.",
        "Explain what editors should enter here.",
        "Add a helpful hint for content editors."
      ]
    });
    if (s === void 0) return;
    const r = (l = this.shadowRoot) == null ? void 0 : l.querySelector("#description-input");
    if (!r) return;
    const i = E(), p = (u = this.property) == null ? void 0 : u.alias, n = await g(this, s, "property-descriptions", i, p);
    n !== void 0 && (r.value = n, r.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, a;
}
export {
  D as createAlchemyDesignEditorPropertyClass
};
//# sourceMappingURL=alchemy-design-editor-property.element-wdWScUnM.js.map
