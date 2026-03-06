import { html, css } from '@umbraco-cms/backoffice/external/lit';
import { openBrewModal } from '../alchemy-brew.open.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';
import { getDocTypeGuidFromUrl } from '../alchemy-brew.collect-property-context.js';

// Exports a factory rather than defining a custom element directly.
// The factory receives the base class (resolved at runtime via customElements.get)
// and returns a subclass to be registered under the original tag name.

type HTMLElementConstructor = new (...args: any[]) => HTMLElement;

export function createAlchemyDesignEditorPropertyClass(Base: HTMLElementConstructor) {
    const baseRender: (this: HTMLElement) => unknown = (Base as any).prototype.render;
    const baseStyles = (Base as any).styles ?? [];

    return class AlchemyDesignEditorPropertyElement extends Base {
        async #onBrewClick() {
            const userPrompt = await openBrewModal(this, {
                prompts: [
                    'Write a concise description for this property.',
                    'Explain what editors should enter here.',
                    'Add a helpful hint for content editors.',
                ],
            });
            if (userPrompt === undefined) return;
            const input = this.shadowRoot?.querySelector('#description-input') as HTMLInputElement | HTMLTextAreaElement | null;
            if (!input) return;

            // This element cannot resolve the workspace context, but the
            // property-type-settings element pushes the context to the backend
            // cache.  We just send the GUID from the URL as the cache key.
            const cacheKey = getDocTypeGuidFromUrl();

            const result = await callBrewApi(this, userPrompt, 'property-descriptions', cacheKey);
            if (result === undefined) return;
            input.value = result;
            input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        }

        updated() {
            // The description textarea lives inside a <p> with no label sibling.
            // We physically move the brew button into that <p> after each render
            // so it appears at the top-right corner of the textarea area.
            const descInput = this.shadowRoot?.querySelector('#description-input');
            const btn = this.shadowRoot?.querySelector('#alchemy-brew-btn');
            if (!descInput || !btn) return;

            const p = descInput.closest('p');
            if (p && !p.contains(btn)) {
                (p as HTMLElement).style.position = 'relative';
                p.appendChild(btn);
            }
        }

        render() {
            return html`
                ${baseRender.call(this)}
                <uui-button
                    id="alchemy-brew-btn"
                    label="Brew description"
                    look="secondary"
                    compact
                    @click=${() => this.#onBrewClick()}>
                    <uui-icon name="icon-wand"></uui-icon>
                </uui-button>
            `;
        }

        static get styles() {
            return [
                ...baseStyles,
                css`
                    #alchemy-brew-btn {
                        position: absolute;
                        top: var(--uui-size-space-1, 2px);
                        right: var(--uui-size-space-1, 2px);
                        z-index: 1;
                    }
                `,
            ];
        }
    };
}
