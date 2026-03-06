import { o as y, c as m } from "./alchemy-brew.call-api-DJDCtWmf.js";
function f(i) {
  var l, s, d;
  const o = (l = i.shadowRoot) == null ? void 0 : l.querySelector('umb-property[alias="label"]'), e = (s = o == null ? void 0 : o.shadowRoot) == null ? void 0 : s.querySelector("umb-property-layout"), r = (d = e == null ? void 0 : e.shadowRoot) == null ? void 0 : d.querySelector("#headerColumn");
  if (!r || r.querySelector("#alchemy-brew-btn")) return;
  const c = new CSSStyleSheet();
  c.replaceSync(`
        #headerColumn {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        #alchemy-brew-btn {
            margin-left: var(--uui-size-space-2, 4px);
            opacity: 0.4;
            transition: opacity 120ms;
        }
        #alchemy-brew-btn:hover,
        #headerColumn:focus-within #alchemy-brew-btn {
            opacity: 1;
        }
    `), e != null && e.shadowRoot && (e.shadowRoot.adoptedStyleSheets = [
    ...e.shadowRoot.adoptedStyleSheets,
    c
  ]);
  const t = document.createElement("uui-button");
  t.id = "alchemy-brew-btn", t.setAttribute("label", "Brew label"), t.setAttribute("look", "secondary"), t.setAttribute("compact", ""), t.innerHTML = '<uui-icon name="icon-wand"></uui-icon>', t.addEventListener("click", async () => {
    var h, w;
    const b = await y(i, {
      prompts: [
        "Return the property alias, e.g. ${ title }",
        "Show title with fallback: ${ title ?? 'Untitled' }",
        "Conditionally show badge: ${ sale ? '🏷️' : ''  }"
      ]
    });
    if (b === void 0) return;
    const p = await m(i, b, "ufm");
    if (p === void 0) return;
    const a = (h = o == null ? void 0 : o.shadowRoot) == null ? void 0 : h.querySelector("umb-property-editor-ui-text-box"), u = (w = a == null ? void 0 : a.shadowRoot) == null ? void 0 : w.querySelector("uui-input");
    u && (u.value = p, u.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  });
  const n = r.querySelector("uui-label");
  n != null && n.nextSibling ? r.insertBefore(t, n.nextSibling) : r.appendChild(t);
}
export {
  f as i
};
//# sourceMappingURL=alchemy-block-type-workspace-view.element-DlHsIGUd.js.map
