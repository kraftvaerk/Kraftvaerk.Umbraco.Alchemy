import { html } from '@umbraco-cms/backoffice/external/lit';
import { openBrewModal } from '../alchemy-brew.open.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';
import { getDocTypeGuidFromUrl } from '../alchemy-brew.collect-property-context.js';
import { attachHoldBehaviour, injectHoldStyles } from '../alchemy-brew.hold.js';

// Strategy 3: Prototype patching for eagerly bundled elements.
// umb-content-type-workspace-editor-header is a direct (non-lazy) import in
// Umbraco's global-components bundle, so it is already registered before our
// entry point runs. customElements.define interception fires too late — we must
// patch the prototype in-place at onInit time.

const HEADER_TAG = 'umb-content-type-workspace-editor-header';

const HEADER_PROMPTS = [
    'Write a concise description for this document type.',
    'Explain what content this type represents.',
    'Add a helpful note for content editors.',
];

async function brewDirectly(host: HTMLElement, prompt: string) {
    const input = host.shadowRoot?.querySelector('#description') as HTMLInputElement | null;
    if (!input) return;
    const cacheKey = getDocTypeGuidFromUrl();
    const result = await callBrewApi(host, prompt, 'document-type-descriptions', cacheKey);
    if (result === undefined) return;
    input.value = result;
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
}

export function patchAlchemyContentTypeHeader() {
    const HeaderClass = customElements.get(HEADER_TAG) as any;
    if (!HeaderClass) return;

    const originalRender: (this: HTMLElement) => unknown = HeaderClass.prototype.render;

    HeaderClass.prototype.render = function () {
        return html`
            ${originalRender.call(this)}
            <uui-button
                id="alchemy-brew-btn"
                label="Brew description"
                look="secondary"
                compact
                @click=${async () => {
                    const userPrompt = await openBrewModal(this, { prompts: HEADER_PROMPTS });
                    if (userPrompt === undefined) return;
                    await brewDirectly(this, userPrompt);
                }}>
                <uui-icon name="icon-wand"></uui-icon>
            </uui-button>
        `;
    };

    HeaderClass.prototype.updated = function () {
        // #description sits alone in a flex-column (#editors). We wrap it
        // together with the brew button in a flex-row div so the button
        // appears inline at the trailing edge of the description input.
        const desc = this.shadowRoot?.querySelector('#description');
        const btn = this.shadowRoot?.querySelector('#alchemy-brew-btn');
        if (!desc || !btn) return;

        // Attach hold-to-brew behaviour (idempotent).
        if (this.shadowRoot) injectHoldStyles(this.shadowRoot);
        attachHoldBehaviour(btn as HTMLElement, () => brewDirectly(this, HEADER_PROMPTS[0]));

        if (!this.shadowRoot?.querySelector('#alchemy-description-row')) {
            const row = document.createElement('div');
            row.id = 'alchemy-description-row';
            desc.parentNode?.insertBefore(row, desc);
            row.appendChild(desc);
            row.appendChild(btn);

            // Inject scoped styles via adoptedStyleSheets — we cannot extend
            // static styles on an already-registered class.
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(`
                #alchemy-description-row {
                    display: flex;
                    align-items: center;
                    gap: var(--uui-size-space-1, 2px);
                }
                #alchemy-description-row #description {
                    flex: 1 1 auto;
                }
            `);
            this.shadowRoot.adoptedStyleSheets = [
                ...this.shadowRoot.adoptedStyleSheets,
                sheet,
            ];
        }
    };
}
