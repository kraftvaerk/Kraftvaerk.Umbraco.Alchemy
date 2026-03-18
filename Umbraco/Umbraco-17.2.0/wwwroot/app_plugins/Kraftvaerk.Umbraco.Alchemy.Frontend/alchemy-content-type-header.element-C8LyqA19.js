import { html as d } from "@umbraco-cms/backoffice/external/lit";
import { o as u, c as l } from "./alchemy-brew.call-api-DciBY2Nb.js";
import { g as h } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
const m = "umb-content-type-workspace-editor-header";
function S() {
  const n = customElements.get(m);
  if (!n) return;
  const p = n.prototype.render;
  n.prototype.render = function() {
    return d`
            ${p.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${async () => {
      var r;
      const e = await u(this, {
        prompts: [
          "Write a concise description for this document type.",
          "Explain what content this type represents.",
          "Add a helpful note for content editors."
        ]
      });
      if (e === void 0) return;
      const t = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#description");
      if (!t) return;
      const i = h(), o = await l(this, e, "document-type-descriptions", i);
      o !== void 0 && (t.value = o, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
    }}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }, n.prototype.updated = function() {
    var i, o, r, s;
    const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#description"), t = (o = this.shadowRoot) == null ? void 0 : o.querySelector("#alchemy-brew-btn");
    if (!(!e || !t) && !((r = this.shadowRoot) != null && r.querySelector("#alchemy-description-row"))) {
      const c = document.createElement("div");
      c.id = "alchemy-description-row", (s = e.parentNode) == null || s.insertBefore(c, e), c.appendChild(e), c.appendChild(t);
      const a = new CSSStyleSheet();
      a.replaceSync(`
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
        a
      ];
    }
  };
}
export {
  S as patchAlchemyContentTypeHeader
};
//# sourceMappingURL=alchemy-content-type-header.element-C8LyqA19.js.map
