import { html as u } from "@umbraco-cms/backoffice/external/lit";
import { o as h, i as y, a as m, c as w } from "./alchemy-brew.hold-BQupQRTz.js";
import { g as f } from "./alchemy-brew.collect-property-context-DIO58BUL.js";
const S = "umb-content-type-workspace-editor-header", p = [
  "Write a concise description for this document type.",
  "Explain what content this type represents.",
  "Add a helpful note for content editors."
];
async function l(t, s) {
  var n;
  const e = (n = t.shadowRoot) == null ? void 0 : n.querySelector("#description");
  if (!e) return;
  const o = f(), i = await w(t, s, "document-type-descriptions", o);
  i !== void 0 && (e.value = i, e.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
}
function v() {
  const t = customElements.get(S);
  if (!t) return;
  const s = t.prototype.render;
  t.prototype.render = function() {
    return u`
            ${s.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${async () => {
      const e = await h(this, { prompts: p });
      e !== void 0 && await l(this, e);
    }}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
  }, t.prototype.updated = function() {
    var i, n, c, a;
    const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#description"), o = (n = this.shadowRoot) == null ? void 0 : n.querySelector("#alchemy-brew-btn");
    if (!(!e || !o) && (this.shadowRoot && y(this.shadowRoot), m(o, () => l(this, p[0])), !((c = this.shadowRoot) != null && c.querySelector("#alchemy-description-row")))) {
      const r = document.createElement("div");
      r.id = "alchemy-description-row", (a = e.parentNode) == null || a.insertBefore(r, e), r.appendChild(e), r.appendChild(o);
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
  v as patchAlchemyContentTypeHeader
};
//# sourceMappingURL=alchemy-content-type-header.element-IC9JdgTt.js.map
