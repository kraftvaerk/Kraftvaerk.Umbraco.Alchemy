import { UmbModalToken as d, UMB_MODAL_MANAGER_CONTEXT as h } from "@umbraco-cms/backoffice/modal";
const m = new d(
  "alchemy.modal.brew",
  { modal: { type: "dialog" } }
);
async function y(e, t = {}) {
  const a = await e.getContext(h);
  if (a)
    try {
      const i = await a.open(e, m, { data: t }).onSubmit();
      return i == null ? void 0 : i.prompt;
    } catch {
      return;
    }
}
const r = 1e3, p = (
  /* css */
  `
    @keyframes alchemy-hold-charge {
        0%   { clip-path: inset(0 100% 0 0); }
        25%  { clip-path: inset(0 0 100% 0); }
        50%  { clip-path: inset(0 0 0 100%); }
        75%  { clip-path: inset(100% 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
    }
    #alchemy-brew-btn {
        position: relative;
        overflow: visible;
    }
    #alchemy-brew-btn::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: var(--uui-border-radius, 3px);
        border: 2px solid var(--uui-color-interactive-emphasis, #3544b1);
        opacity: 0;
        pointer-events: none;
        box-sizing: border-box;
    }
    #alchemy-brew-btn.alchemy-holding::after {
        opacity: 1;
        animation: alchemy-hold-charge ${r}ms linear forwards;
    }
    #alchemy-brew-btn.alchemy-held {
        animation: alchemy-pulse 400ms ease-out;
    }
    @keyframes alchemy-pulse {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.25); }
        100% { transform: scale(1); }
    }
`
), l = /* @__PURE__ */ new WeakSet();
function f(e) {
  if (l.has(e)) return;
  l.add(e);
  const t = new CSSStyleSheet();
  t.replaceSync(p), e instanceof ShadowRoot ? e.adoptedStyleSheets = [...e.adoptedStyleSheets, t] : document.adoptedStyleSheets = [...document.adoptedStyleSheets, t];
}
function v(e, t) {
  if (e.__alchemyHold) return;
  e.__alchemyHold = !0;
  let a, o = !1;
  const i = (n) => {
    n instanceof PointerEvent && n.button !== 0 || (o = !1, e.classList.add("alchemy-holding"), a = setTimeout(() => {
      o = !0, e.classList.remove("alchemy-holding"), e.classList.add("alchemy-held"), setTimeout(() => e.classList.remove("alchemy-held"), 400), t();
    }, r));
  }, s = () => {
    a !== void 0 && (clearTimeout(a), a = void 0), e.classList.remove("alchemy-holding");
  }, c = (n) => {
    o && (n.stopImmediatePropagation(), n.preventDefault(), o = !1);
  };
  e.addEventListener("pointerdown", i), e.addEventListener("pointerup", s), e.addEventListener("pointerleave", s), e.addEventListener("pointercancel", s), e.addEventListener("click", c, !0);
}
export {
  p as H,
  v as a,
  f as i,
  y as o
};
//# sourceMappingURL=alchemy-brew.hold-CI8ek3FG.js.map
