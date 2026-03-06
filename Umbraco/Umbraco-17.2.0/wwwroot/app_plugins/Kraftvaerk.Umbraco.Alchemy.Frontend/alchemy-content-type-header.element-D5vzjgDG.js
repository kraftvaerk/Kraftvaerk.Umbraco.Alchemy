import { html as d } from "@umbraco-cms/backoffice/external/lit";
import { o as l, c as u } from "./alchemy-brew.call-api-DeSbS4X6.js";
const h = "umb-content-type-workspace-editor-header";
function w() {
  const n = customElements.get(h);
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
      const e = await l(this, {
        prompts: [
          "Write a concise description for this document type.",
          "Explain what content this type represents.",
          "Add a helpful note for content editors."
        ]
      });
      if (e === void 0) return;
      const t = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#description");
      if (!t) return;
      const o = await u(this, e, "property-descriptions");
      o !== void 0 && (t.value = o, t.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
    }}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }, n.prototype.updated = function() {
    var o, r, s, c;
    const e = (o = this.shadowRoot) == null ? void 0 : o.querySelector("#description"), t = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#alchemy-brew-btn");
    if (!(!e || !t) && !((s = this.shadowRoot) != null && s.querySelector("#alchemy-description-row"))) {
      const i = document.createElement("div");
      i.id = "alchemy-description-row", (c = e.parentNode) == null || c.insertBefore(i, e), i.appendChild(e), i.appendChild(t);
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
  w as patchAlchemyContentTypeHeader
};
//# sourceMappingURL=alchemy-content-type-header.element-D5vzjgDG.js.map
