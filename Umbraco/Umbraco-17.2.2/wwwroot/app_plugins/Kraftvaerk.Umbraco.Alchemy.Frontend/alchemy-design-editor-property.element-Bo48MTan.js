var w = (t) => {
  throw TypeError(t);
};
var f = (t, e, o) => e.has(t) || w("Cannot " + o);
var d = (t, e, o) => (f(t, e, "read from private field"), o ? o.call(t) : e.get(t)), h = (t, e, o) => e.has(t) ? w("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o);
var u = (t, e, o) => (f(t, e, "access private method"), o);
import { html as R, css as g } from "@umbraco-cms/backoffice/external/lit";
import { o as E, i as S, a as x } from "./alchemy-brew.hold-CI8ek3FG.js";
import { c as A } from "./alchemy-brew.call-api-9xYIgl5a.js";
import { g as P } from "./alchemy-brew.collect-property-context-Bw4lto7E.js";
function H(t) {
  var i, a, s, y, v;
  const e = t.prototype.render, o = t.styles ?? [];
  return i = class extends t {
    constructor() {
      super(...arguments);
      h(this, s);
    }
    updated() {
      var l, p;
      const n = (l = this.shadowRoot) == null ? void 0 : l.querySelector("#description-input"), r = (p = this.shadowRoot) == null ? void 0 : p.querySelector("#alchemy-brew-btn");
      if (!n || !r) return;
      const c = n.closest("p");
      c && !c.contains(r) && (c.style.position = "relative", c.appendChild(r)), this.shadowRoot && S(this.shadowRoot), x(
        r,
        () => u(this, s, y).call(this, d(i, a)[0])
      );
    }
    render() {
      return R`
                ${e.call(this)}
                <uui-button
                    id="alchemy-brew-btn"
                    label="Brew description"
                    look="default"
                    compact
                    @click=${() => u(this, s, v).call(this)}>
                    <uui-icon name="alchemy-brew-bottle"></uui-icon>
                </uui-button>
            `;
    }
    static get styles() {
      return [
        ...o,
        g`
                    #alchemy-brew-btn {
                        position: absolute;
                        bottom: 0;
                        right: var(--uui-size-space-1, 2px);
                        z-index: 1;
                    }
                `
      ];
    }
  }, a = new WeakMap(), s = new WeakSet(), y = async function(n) {
    var m, b;
    const r = (m = this.shadowRoot) == null ? void 0 : m.querySelector("#description-input");
    if (!r) return;
    const c = P(), l = (b = this.property) == null ? void 0 : b.alias, p = await A(this, n, "property-descriptions", c, l);
    p !== void 0 && (r.value = p, r.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, v = async function() {
    const n = await E(this, {
      prompts: d(i, a)
    });
    n !== void 0 && await u(this, s, y).call(this, n);
  }, h(i, a, [
    "Write a concise description for this property.",
    "Explain what editors should enter here.",
    "Add a helpful hint for content editors."
  ]), i;
}
export {
  H as createAlchemyDesignEditorPropertyClass
};
//# sourceMappingURL=alchemy-design-editor-property.element-Bo48MTan.js.map
