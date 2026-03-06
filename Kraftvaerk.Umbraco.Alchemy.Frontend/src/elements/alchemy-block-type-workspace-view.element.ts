// Shared injection helper for block type workspace views.
// Called from alchemy-block-grid-workspace-view.element.ts and
// alchemy-block-list-workspace-view.element.ts.
//
// The UFM "Label" field has alias="label" and renders as <umb-property>.
// umb-property owns its shadow DOM (Lit), so we pierce into it and inject the
// brew button directly — Lit diffing leaves foreign nodes untouched.

import { openBrewModal } from '../alchemy-brew.open.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';

export function injectAlchemyBrewButton(host: HTMLElement): void {
    // Pierce: host shadow → umb-property → umb-property-layout shadow → #headerColumn
    const propEl = host.shadowRoot?.querySelector('umb-property[alias="label"]');
    const layoutEl = propEl?.shadowRoot?.querySelector('umb-property-layout') as Element | undefined;
    const headerCol = layoutEl?.shadowRoot?.querySelector('#headerColumn');
    if (!headerCol) return;
    if (headerCol.querySelector('#alchemy-brew-btn')) return;

    // Make #headerColumn flex so the button sits inline next to the label.
    // This shadow root belongs to this specific umb-property-layout instance
    // so the style only affects the Label row, not other properties.
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
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
    `);
    if (layoutEl?.shadowRoot) {
        layoutEl.shadowRoot.adoptedStyleSheets = [
            ...layoutEl.shadowRoot.adoptedStyleSheets,
            sheet,
        ];
    }

    const btn = document.createElement('uui-button') as HTMLElement;
    btn.id = 'alchemy-brew-btn';
    btn.setAttribute('label', 'Brew label');
    btn.setAttribute('look', 'secondary');
    btn.setAttribute('compact', '');
    btn.innerHTML = '<uui-icon name="icon-wand"></uui-icon>';
    btn.addEventListener('click', async () => {
        const userPrompt = await openBrewModal(host, {
            prompts: [
                'Return the property alias, e.g. ${ title }',
                'Show title with fallback: ${ title ?? \'Untitled\' }',
                'Conditionally show badge: ${ sale ? \'🏷️\' : \'\'  }',
            ],
        });
        if (userPrompt === undefined) return;
        const result = await callBrewApi(host, userPrompt, 'ufm');
        if (result === undefined) return;
        // Pierce umb-property → umb-property-editor-ui-text-box → uui-input
        const textBox = propEl?.shadowRoot?.querySelector('umb-property-editor-ui-text-box');
        const uuiInput = textBox?.shadowRoot?.querySelector('uui-input') as HTMLElement | null;
        if (!uuiInput) return;
        (uuiInput as any).value = result;
        uuiInput.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    });

    // Insert right after uui-label so tab order is natural.
    const label = headerCol.querySelector('uui-label');
    if (label?.nextSibling) {
        headerCol.insertBefore(btn, label.nextSibling);
    } else {
        headerCol.appendChild(btn);
    }
}
