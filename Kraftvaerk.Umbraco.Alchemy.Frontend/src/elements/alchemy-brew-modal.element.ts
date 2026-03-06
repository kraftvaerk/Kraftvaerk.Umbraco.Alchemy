import { html, css, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import type { AlchemyBrewModalData, AlchemyBrewModalValue } from '../alchemy-brew.modal-token.js';

/**
 * Alchemy Brew modal.
 *
 * Presents 0–3 predefined prompt buttons and a free-text textarea.
 * Clicking a predefined prompt is equivalent to typing it and pressing OK.
 * The `context` property is forwarded to the caller but never shown in the UI.
 */
@customElement('alchemy-brew-modal')
export class AlchemyBrewModalElement
    extends UmbLitElement
    implements UmbModalExtensionElement<AlchemyBrewModalData, AlchemyBrewModalValue> {

    modalContext?: any;

    @state() private _text = '';

    /** Quick-select a predefined prompt and submit immediately. */
    #selectPrompt(prompt: string) {
        this.modalContext?.updateValue({ prompt });
        this.modalContext?.submit();
    }

    #submit() {
        const text = this._text.trim();
        if (!text) return;
        this.modalContext?.updateValue({ prompt: text });
        this.modalContext?.submit();
    }

    #cancel() {
        this.modalContext?.reject();
    }

    render() {
        const prompts: string[] = this.modalContext?.data?.prompts ?? [];

        return html`
            <umb-body-layout headline="Brew with AI">
                <uui-box>
                    ${prompts.length
                        ? html`
                            <div id="alchemy-prompts">
                                ${prompts.map(
                                    (p) => html`
                                        <uui-button
                                            look="secondary"
                                            label=${p}
                                            @click=${() => this.#selectPrompt(p)}>
                                            ${p}
                                        </uui-button>
                                    `,
                                )}
                            </div>
                        `
                        : ''}

                    <uui-textarea
                        id="alchemy-prompt-input"
                        placeholder="Type a prompt…"
                        auto-height
                        .value=${this._text}
                        @input=${(e: InputEvent) => { this._text = (e.target as HTMLTextAreaElement).value; }}>
                    </uui-textarea>
                </uui-box>

                <div slot="actions">
                    <uui-button
                        look="secondary"
                        label="Cancel"
                        @click=${() => this.#cancel()}>
                        Cancel
                    </uui-button>
                    <uui-button
                        look="primary"
                        color="positive"
                        label="OK"
                        .disabled=${!this._text.trim()}
                        @click=${() => this.#submit()}>
                        OK
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
    }

    static override get styles() {
        return css`
            uui-box {
                display: block;
            }

            #alchemy-prompts {
                display: flex;
                flex-wrap: wrap;
                gap: var(--uui-size-space-2, 4px);
                margin-bottom: var(--uui-size-space-4, 12px);
            }

            #alchemy-prompts uui-button {
                --uui-button-background-color: var(--uui-color-surface-alt, #f3f3f5);
                --uui-button-background-color-hover: var(--uui-color-surface-emphasis, #e6e6ea);
            }

            uui-textarea {
                width: 100%;
                min-height: 80px;
            }

            div[slot='actions'] {
                display: flex;
                gap: var(--uui-size-space-2, 4px);
            }
        `;
    }
}

export default AlchemyBrewModalElement;

declare global {
    interface HTMLElementTagNameMap {
        'alchemy-brew-modal': AlchemyBrewModalElement;
    }
}
