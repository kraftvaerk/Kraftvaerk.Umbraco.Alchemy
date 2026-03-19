import { html, css, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import type { DoAlchemyModalData, DoAlchemyModalValue, DoAlchemyMode } from '../alchemy-do-alchemy.modal-token.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';
import { UmbDocumentTypeDetailRepository } from '@umbraco-cms/backoffice/document-type';

interface BrewRow {
    label: string;
    contextAlias: string;
    targetPropertyAlias: string | null;
    status: 'pending' | 'brewing' | 'done' | 'error';
    result: string | null;
}

@customElement('alchemy-do-alchemy-modal')
export class AlchemyDoAlchemyModalElement
    extends UmbLitElement
    implements UmbModalExtensionElement<DoAlchemyModalData, DoAlchemyModalValue>
{
    modalContext?: any;

    @state() private _phase: 'choose' | 'brewing' | 'saving' | 'saved' = 'choose';
    @state() private _rows: BrewRow[] = [];
    @state() private _saveError: string | null = null;

    #buildRows(mode: DoAlchemyMode): BrewRow[] {
        const data: DoAlchemyModalData | undefined = this.modalContext?.data;
        if (!data) return [];

        const rows: BrewRow[] = [];

        // Content type description row
        const hasDescription = !!data.documentTypeDescription?.trim();
        if (mode === 'everything' || !hasDescription) {
            rows.push({
                label: 'Content Type Description',
                contextAlias: 'document-type-descriptions',
                targetPropertyAlias: null,
                status: 'pending',
                result: null,
            });
        }

        // Property rows
        for (const prop of data.properties) {
            const propHasDesc = !!prop.description?.trim();
            if (mode === 'everything' || !propHasDesc) {
                rows.push({
                    label: prop.name || prop.alias,
                    contextAlias: 'property-descriptions',
                    targetPropertyAlias: prop.alias,
                    status: 'pending',
                    result: null,
                });
            }
        }

        return rows;
    }

    async #start(mode: DoAlchemyMode) {
        this._rows = this.#buildRows(mode);
        this._phase = 'brewing';

        const cacheKey = this.modalContext?.data?.unique;

        // Brew all rows sequentially to avoid overwhelming the API
        for (let i = 0; i < this._rows.length; i++) {
            const row = this._rows[i];
            row.status = 'brewing';
            this._rows = [...this._rows];

            const prompt = row.targetPropertyAlias
                ? `Write a description for the "${row.label}" property`
                : `Write a description for this content type`;

            const result = await callBrewApi(
                this as unknown as HTMLElement,
                prompt,
                row.contextAlias,
                cacheKey,
                row.targetPropertyAlias ?? undefined,
            );

            row.status = result ? 'done' : 'error';
            row.result = result ?? 'Failed to generate';
            this._rows = [...this._rows];
        }
    }

    #close() {
        this.modalContext?.reject();
    }

    get #allDone() {
        return this._rows.length > 0 && this._rows.every((r) => r.status === 'done' || r.status === 'error');
    }

    get #hasSuccessfulResults() {
        return this._rows.some((r) => r.status === 'done' && r.result);
    }

    async #accept() {
        const unique = (this.modalContext?.data as DoAlchemyModalData | undefined)?.unique;
        if (!unique) return;

        this._phase = 'saving';
        this._saveError = null;

        try {
            const repo = new UmbDocumentTypeDetailRepository(this);
            const { data: frozen } = await repo.requestByUnique(unique);
            if (!frozen) {
                this._saveError = 'Could not load document type';
                this._phase = 'brewing';
                return;
            }

            // Deep clone — the store returns a frozen object
            const model = structuredClone(frozen);

            // Apply brewed descriptions
            for (const row of this._rows) {
                if (row.status !== 'done' || !row.result) continue;

                if (!row.targetPropertyAlias) {
                    // Content type description
                    model.description = row.result;
                } else {
                    // Property description
                    const prop = model.properties?.find((p) => p.alias === row.targetPropertyAlias);
                    if (prop) {
                        prop.description = row.result;
                    }
                }
            }

            await repo.save(model);
            this.modalContext?.submit();
        } catch (err) {
            console.error('[Alchemy] Save failed:', err);
            this._saveError = 'Failed to save document type';
            this._phase = 'brewing';
        }
    }

    render() {
        return html`
            <umb-body-layout headline="Do Alchemy">
                ${this._phase === 'choose' ? this.#renderChoose() : this.#renderBrewing()}
                <div slot="actions">
                    ${this._phase === 'brewing' && this.#allDone && this.#hasSuccessfulResults
                        ? html`
                            <uui-button
                                look="primary"
                                color="positive"
                                label="Accept"
                                @click=${this.#accept}>
                                Accept
                            </uui-button>
                        `
                        : ''}
                    ${this._phase === 'saving'
                        ? html`
                            <uui-button look="primary" color="positive" label="Saving…" disabled>
                                <uui-loader-circle></uui-loader-circle> Saving…
                            </uui-button>
                        `
                        : ''}
                    ${this._phase === 'saved'
                        ? html`
                            <uui-button look="primary" color="positive" label="Saved" disabled>
                                ✓ Saved
                            </uui-button>
                        `
                        : ''}
                    <uui-button look="secondary" label="Close" @click=${this.#close}>
                        ${this._phase === 'choose' ? 'Cancel' : 'Close'}
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
    }

    #renderChoose() {
        const data = this.modalContext?.data as DoAlchemyModalData | undefined;
        const blankCount = this.#buildRows('blanks').length;
        const totalCount = this.#buildRows('everything').length;

        return html`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${data?.documentTypeName ?? 'this content type'}</strong>.
                </p>
                <div id="mode-buttons">
                    <uui-button
                        look="outline"
                        label="Brew The Blanks"
                        .disabled=${blankCount === 0}
                        @click=${() => this.#start('blanks')}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew The Blanks
                        <small>(${blankCount} item${blankCount !== 1 ? 's' : ''})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew Everything"
                        .disabled=${totalCount === 0}
                        @click=${() => this.#start('everything')}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew Everything
                        <small>(${totalCount} item${totalCount !== 1 ? 's' : ''})</small>
                    </uui-button>
                </div>
            </uui-box>
        `;
    }

    #renderBrewing() {
        return html`
            <uui-box>
                ${this._saveError
                    ? html`<div class="save-error">${this._saveError}</div>`
                    : ''}
                ${this._phase === 'saved'
                    ? html`<div class="save-success">All descriptions have been saved to the document type.</div>`
                    : ''}
                <uui-table>
                    <uui-table-head>
                        <uui-table-head-cell>Field</uui-table-head-cell>
                        <uui-table-head-cell>Result</uui-table-head-cell>
                    </uui-table-head>
                    ${this._rows.map(
                        (row) => html`
                            <uui-table-row>
                                <uui-table-cell class="field-cell">
                                    ${row.label}
                                </uui-table-cell>
                                <uui-table-cell class="result-cell">
                                    ${this.#renderStatus(row)}
                                </uui-table-cell>
                            </uui-table-row>
                        `,
                    )}
                </uui-table>
            </uui-box>
        `;
    }

    #renderStatus(row: BrewRow) {
        switch (row.status) {
            case 'pending':
                return html`<span class="status-pending">Waiting…</span>`;
            case 'brewing':
                return html`<span class="status-brewing"><uui-loader-circle></uui-loader-circle> Brewing…</span>`;
            case 'done':
                return html`<span class="status-done">${row.result}</span>`;
            case 'error':
                return html`<span class="status-error">Failed to generate</span>`;
        }
    }

    static override get styles() {
        return css`
            uui-box {
                display: block;
            }

            #mode-buttons {
                display: flex;
                flex-direction: column;
                gap: var(--uui-size-space-3, 8px);
            }

            #mode-buttons uui-button {
                width: 100%;
                --uui-button-font-size: var(--uui-type-default-size, 14px);
            }

            #mode-buttons small {
                opacity: 0.6;
                margin-left: 4px;
            }

            uui-table {
                width: 100%;
            }

            .field-cell {
                font-weight: 600;
                white-space: nowrap;
                width: 1%;
                padding-right: var(--uui-size-space-4, 12px);
            }

            .result-cell {
                word-break: break-word;
            }

            .status-pending {
                opacity: 0.4;
                font-style: italic;
            }

            .status-brewing {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--uui-color-interactive, #1b264f);
            }

            .status-brewing uui-loader-circle {
                font-size: 16px;
            }

            .status-done {
                color: var(--uui-color-positive, #2bc37c);
            }

            .status-error {
                color: var(--uui-color-danger, #d42054);
                font-style: italic;
            }

            div[slot='actions'] {
                display: flex;
                gap: var(--uui-size-space-2, 4px);
            }

            .save-error {
                color: var(--uui-color-danger, #d42054);
                padding: var(--uui-size-space-3, 8px);
                margin-bottom: var(--uui-size-space-3, 8px);
                border: 1px solid var(--uui-color-danger, #d42054);
                border-radius: var(--uui-border-radius, 3px);
            }

            .save-success {
                color: var(--uui-color-positive, #2bc37c);
                padding: var(--uui-size-space-3, 8px);
                margin-bottom: var(--uui-size-space-3, 8px);
                border: 1px solid var(--uui-color-positive, #2bc37c);
                border-radius: var(--uui-border-radius, 3px);
            }
        `;
    }
}

export default AlchemyDoAlchemyModalElement;

declare global {
    interface HTMLElementTagNameMap {
        'alchemy-do-alchemy-modal': AlchemyDoAlchemyModalElement;
    }
}
