/**
 * Press-and-hold behaviour for brew buttons.
 *
 * While the user holds down the button for 1 second an animated border
 * "charges" around the button in Umbraco blue. On completion the supplied
 * callback fires with the first prompt, skipping the modal entirely.
 * A normal click (release before 1 s) does nothing — the regular @click
 * handler will fire instead.
 */

const HOLD_DURATION_MS = 1000;

/**
 * CSS that must be injected into the shadow root (or document) containing the
 * brew button. Call {@link injectHoldStyles} once per shadow root.
 */
export const HOLD_CSS = /* css */ `
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
        animation: alchemy-hold-charge ${HOLD_DURATION_MS}ms linear forwards;
    }
    #alchemy-brew-btn.alchemy-held {
        animation: alchemy-pulse 400ms ease-out;
    }
    @keyframes alchemy-pulse {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.25); }
        100% { transform: scale(1); }
    }
`;

/** Set of shadow roots that already have the hold styles injected. */
const injected = new WeakSet<ShadowRoot | Document>();

/**
 * Ensures the hold animation styles are present in the given root.
 * Safe to call repeatedly — only injects once per root.
 */
export function injectHoldStyles(root: ShadowRoot | Document): void {
    if (injected.has(root)) return;
    injected.add(root);
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(HOLD_CSS);
    if (root instanceof ShadowRoot) {
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    } else {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }
}

/**
 * Attaches press-and-hold listeners to a brew button. When the user holds for
 * 1 second the `onHeld` callback fires. A short click is left to the normal
 * @click handler on the element.
 *
 * @param btn     - The `#alchemy-brew-btn` element.
 * @param onHeld  - Callback invoked after a successful hold.
 */
export function attachHoldBehaviour(btn: HTMLElement, onHeld: () => void): void {
    // Guard against double-attaching.
    if ((btn as any).__alchemyHold) return;
    (btn as any).__alchemyHold = true;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let held = false;

    const start = (e: Event) => {
        // Only primary button / single touch.
        if (e instanceof PointerEvent && e.button !== 0) return;
        held = false;
        btn.classList.add('alchemy-holding');
        timer = setTimeout(() => {
            held = true;
            btn.classList.remove('alchemy-holding');
            btn.classList.add('alchemy-held');
            setTimeout(() => btn.classList.remove('alchemy-held'), 400);
            onHeld();
        }, HOLD_DURATION_MS);
    };

    const cancel = () => {
        if (timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
        }
        btn.classList.remove('alchemy-holding');
    };

    // Suppress the normal click when the hold completed.
    const suppressClick = (e: Event) => {
        if (held) {
            e.stopImmediatePropagation();
            e.preventDefault();
            held = false;
        }
    };

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('pointercancel', cancel);
    // Must be registered *before* the existing @click via capture phase
    // so we can suppress the click that Lit bound.
    btn.addEventListener('click', suppressClick, true);
}
