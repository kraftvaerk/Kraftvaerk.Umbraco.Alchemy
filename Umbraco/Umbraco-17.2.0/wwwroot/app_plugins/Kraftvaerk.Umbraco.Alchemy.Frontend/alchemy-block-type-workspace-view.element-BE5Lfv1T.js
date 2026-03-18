import { H as g, o as q, a as C, c as B } from "./alchemy-brew.hold-BQupQRTz.js";
const R = [
  "Generate a label using the most identifying property",
  "Show the main property with a fallback for empty state",
  "Combine two properties into a short label"
];
function A(o) {
  var d, w, y;
  const r = (d = o.shadowRoot) == null ? void 0 : d.querySelector('umb-property[alias="label"]'), t = (w = r == null ? void 0 : r.shadowRoot) == null ? void 0 : w.querySelector("umb-property-layout"), n = (y = t == null ? void 0 : t.shadowRoot) == null ? void 0 : y.querySelector("#headerColumn");
  if (!n || n.querySelector("#alchemy-brew-btn")) return;
  const l = new CSSStyleSheet();
  l.replaceSync(`
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
        ${g}
    `), t != null && t.shadowRoot && (t.shadowRoot.adoptedStyleSheets = [
    ...t.shadowRoot.adoptedStyleSheets,
    l
  ]);
  const p = async (c) => {
    var h, S, f, v;
    let b;
    try {
      const a = await ((h = o.getContext) == null ? void 0 : h.call(o, "UmbWorkspaceContext"));
      b = (S = a == null ? void 0 : a.getUnique) == null ? void 0 : S.call(a);
    } catch {
    }
    const m = await B(o, c, "ufm", b);
    if (m === void 0) return;
    const u = (f = r == null ? void 0 : r.shadowRoot) == null ? void 0 : f.querySelector("umb-property-editor-ui-text-box"), s = (v = u == null ? void 0 : u.shadowRoot) == null ? void 0 : v.querySelector("uui-input");
    s && (s.value = m, s.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, e = document.createElement("uui-button");
  e.id = "alchemy-brew-btn", e.setAttribute("label", "Brew label"), e.setAttribute("look", "secondary"), e.setAttribute("compact", ""), e.innerHTML = '<uui-icon name="icon-wand"></uui-icon>', e.addEventListener("click", async () => {
    const c = await q(o, { prompts: R });
    c !== void 0 && await p(c);
  }), C(e, () => p(R[0]));
  const i = n.querySelector("uui-label");
  i != null && i.nextSibling ? n.insertBefore(e, i.nextSibling) : n.appendChild(e);
}
export {
  A as i
};
//# sourceMappingURL=alchemy-block-type-workspace-view.element-BE5Lfv1T.js.map
