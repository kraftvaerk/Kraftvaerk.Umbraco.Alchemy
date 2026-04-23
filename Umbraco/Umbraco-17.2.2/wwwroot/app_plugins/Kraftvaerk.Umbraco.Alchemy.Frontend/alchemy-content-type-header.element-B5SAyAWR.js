import { html as h } from "@umbraco-cms/backoffice/external/lit";
import { o as y, i as m, a as w } from "./alchemy-brew.hold-CI8ek3FG.js";
import { c as f } from "./alchemy-brew.call-api-C3Bu3Kal.js";
import { g as b } from "./alchemy-brew.collect-property-context-DEp7QA2I.js";
const S = "umb-content-type-workspace-editor-header", l = [
  "Write a concise description for this document type.",
  "Explain what content this type represents.",
  "Add a helpful note for content editors."
];
async function u(e, s) {
  var i;
  const o = (i = e.shadowRoot) == null ? void 0 : i.querySelector("#description");
  if (!o) return;
  const t = b(), r = await f(e, s, "document-type-descriptions", t);
  r !== void 0 && (o.value = r, o.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
}
function H() {
  const e = customElements.get(S);
  if (!e) return;
  const s = e.prototype.render;
  e.prototype.render = function() {
    return h`
            ${s.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="default"
                compact
                @click=${async () => {
      const t = await y(this, { prompts: l });
      t !== void 0 && await u(this, t);
    }}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
        `;
  };
  const o = e.prototype.updated;
  e.prototype.updated = function() {
    var i, c, a, p;
    o == null || o.call(this);
    const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#description"), r = (c = this.shadowRoot) == null ? void 0 : c.querySelector("#alchemy-brew-btn");
    if (!(!t || !r) && (this.shadowRoot && m(this.shadowRoot), w(r, () => u(this, l[0])), !((a = this.shadowRoot) != null && a.querySelector("#alchemy-description-row")))) {
      const n = document.createElement("div");
      n.id = "alchemy-description-row", (p = t.parentNode) == null || p.insertBefore(n, t), n.appendChild(t), n.appendChild(r);
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
  H as patchAlchemyContentTypeHeader
};
//# sourceMappingURL=alchemy-content-type-header.element-B5SAyAWR.js.map
