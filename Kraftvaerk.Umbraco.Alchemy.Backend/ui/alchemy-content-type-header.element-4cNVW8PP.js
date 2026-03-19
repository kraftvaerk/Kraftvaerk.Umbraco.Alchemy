import { html as u } from "@umbraco-cms/backoffice/external/lit";
import { o as h, i as m, a as y } from "./alchemy-brew.hold-CI8ek3FG.js";
import { c as w } from "./alchemy-brew.call-api-C2THZJKp.js";
import { g as f } from "./alchemy-brew.collect-property-context-6hUBx9A2.js";
const b = "umb-content-type-workspace-editor-header", p = [
  "Write a concise description for this document type.",
  "Explain what content this type represents.",
  "Add a helpful note for content editors."
];
async function l(t, s) {
  var i;
  const e = (i = t.shadowRoot) == null ? void 0 : i.querySelector("#description");
  if (!e) return;
  const o = f(), r = await w(t, s, "document-type-descriptions", o);
  r !== void 0 && (e.value = r, e.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
}
function g() {
  const t = customElements.get(b);
  if (!t) return;
  const s = t.prototype.render;
  t.prototype.render = function() {
    return u`
            ${s.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="default"
                compact
                @click=${async () => {
      const e = await h(this, { prompts: p });
      e !== void 0 && await l(this, e);
    }}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
        `;
  }, t.prototype.updated = function() {
    var r, i, c, a;
    const e = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#description"), o = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#alchemy-brew-btn");
    if (!(!e || !o) && (this.shadowRoot && m(this.shadowRoot), y(o, () => l(this, p[0])), !((c = this.shadowRoot) != null && c.querySelector("#alchemy-description-row")))) {
      const n = document.createElement("div");
      n.id = "alchemy-description-row", (a = e.parentNode) == null || a.insertBefore(n, e), n.appendChild(e), n.appendChild(o);
      const d = new CSSStyleSheet();
      d.replaceSync(`
                #alchemy-description-row {
                    display: flex;
                    align-items: center;
                    gap: var(--uui-size-space-1, 2px);
                }
                #alchemy-description-row #description {
                    flex: 1 1 auto;
                }
            `), this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        d
      ];
    }
  };
}
export {
  g as patchAlchemyContentTypeHeader
};
//# sourceMappingURL=alchemy-content-type-header.element-4cNVW8PP.js.map
