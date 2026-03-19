import { H as g, o as q, a as C } from "./alchemy-brew.hold-CI8ek3FG.js";
import { c as B } from "./alchemy-brew.call-api-9xYIgl5a.js";
const R = [
  "Generate a label using the most identifying property",
  "Show the main property with a fallback for empty state",
  "Combine two properties into a short label"
];
function H(o) {
  var m, b, d;
  const r = (m = o.shadowRoot) == null ? void 0 : m.querySelector('umb-property[alias="label"]'), t = (b = r == null ? void 0 : r.shadowRoot) == null ? void 0 : b.querySelector("umb-property-layout"), a = (d = t == null ? void 0 : t.shadowRoot) == null ? void 0 : d.querySelector("#headerColumn");
  if (!a || a.querySelector("#alchemy-brew-btn")) return;
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
    let w;
    try {
      const n = await ((h = o.getContext) == null ? void 0 : h.call(o, "UmbWorkspaceContext"));
      w = (S = n == null ? void 0 : n.getUnique) == null ? void 0 : S.call(n);
    } catch {
    }
    const y = await B(o, c, "ufm", w);
    if (y === void 0) return;
    const u = (f = r == null ? void 0 : r.shadowRoot) == null ? void 0 : f.querySelector("umb-property-editor-ui-text-box"), s = (v = u == null ? void 0 : u.shadowRoot) == null ? void 0 : v.querySelector("uui-input");
    s && (s.value = y, s.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })));
  }, e = document.createElement("uui-button");
  e.id = "alchemy-brew-btn", e.setAttribute("label", "Brew label"), e.setAttribute("look", "default"), e.setAttribute("compact", ""), e.innerHTML = '<uui-icon name="alchemy-brew-bottle"></uui-icon>', e.addEventListener("click", async () => {
    const c = await q(o, { prompts: R });
    c !== void 0 && await p(c);
  }), C(e, () => p(R[0]));
  const i = a.querySelector("uui-label");
  i != null && i.nextSibling ? a.insertBefore(e, i.nextSibling) : a.appendChild(e);
}
export {
  H as i
};
//# sourceMappingURL=alchemy-block-type-workspace-view.element-BEBwwHqb.js.map
