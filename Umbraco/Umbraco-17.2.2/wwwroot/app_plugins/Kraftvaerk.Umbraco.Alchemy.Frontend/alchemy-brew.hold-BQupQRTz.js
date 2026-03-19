import { UmbModalToken as p, UMB_MODAL_MANAGER_CONTEXT as h } from "@umbraco-cms/backoffice/modal";
import { UMB_AUTH_CONTEXT as u } from "@umbraco-cms/backoffice/auth";
import { p as y } from "./sdk.gen-BrMQUxj_.js";
const f = new p(
  "alchemy.modal.brew",
  { modal: { type: "dialog" } }
);
async function _(e, t = {}) {
  const a = await e.getContext(h);
  if (a)
    try {
      const r = await a.open(e, f, { data: t }).onSubmit();
      return r == null ? void 0 : r.prompt;
    } catch {
      return;
    }
}
async function b(e, t, a, n, r) {
  var c;
  const o = await e.getContext(u), i = (c = o == null ? void 0 : o.getOpenApiConfiguration) == null ? void 0 : c.call(o), s = typeof (i == null ? void 0 : i.token) == "function" ? await i.token() : i == null ? void 0 : i.token;
  try {
    const { data: l } = await y({
      baseUrl: window.location.origin,
      auth: s,
      body: { prompt: t, contextAlias: a, cacheKey: n, targetPropertyAlias: r }
    });
    return l != null && l.result ? l.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, "").trim() : void 0;
  } catch {
    return;
  }
}
const m = 1e3, v = (
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
        animation: alchemy-hold-charge ${m}ms linear forwards;
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
), d = /* @__PURE__ */ new WeakSet();
function g(e) {
  if (d.has(e)) return;
  d.add(e);
  const t = new CSSStyleSheet();
  t.replaceSync(v), e instanceof ShadowRoot ? e.adoptedStyleSheets = [...e.adoptedStyleSheets, t] : document.adoptedStyleSheets = [...document.adoptedStyleSheets, t];
}
function k(e, t) {
  if (e.__alchemyHold) return;
  e.__alchemyHold = !0;
  let a, n = !1;
  const r = (s) => {
    s instanceof PointerEvent && s.button !== 0 || (n = !1, e.classList.add("alchemy-holding"), a = setTimeout(() => {
      n = !0, e.classList.remove("alchemy-holding"), e.classList.add("alchemy-held"), setTimeout(() => e.classList.remove("alchemy-held"), 400), t();
    }, m));
  }, o = () => {
    a !== void 0 && (clearTimeout(a), a = void 0), e.classList.remove("alchemy-holding");
  }, i = (s) => {
    n && (s.stopImmediatePropagation(), s.preventDefault(), n = !1);
  };
  e.addEventListener("pointerdown", r), e.addEventListener("pointerup", o), e.addEventListener("pointerleave", o), e.addEventListener("pointercancel", o), e.addEventListener("click", i, !0);
}
export {
  v as H,
  k as a,
  b as c,
  g as i,
  _ as o
};
//# sourceMappingURL=alchemy-brew.hold-BQupQRTz.js.map
