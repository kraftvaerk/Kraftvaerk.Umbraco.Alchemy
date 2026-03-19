import { html, css, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import type { DoAlchemyModalData, DoAlchemyModalValue, DoAlchemyMode } from '../alchemy-do-alchemy.modal-token.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';
import { UmbDocumentTypeDetailRepository } from '@umbraco-cms/backoffice/document-type';

type RowKind = 'description' | 'icon';

interface BrewRow {
    kind: RowKind;
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
    @state() private _rebrewRow: BrewRow | null = null;
    @state() private _rebrewInstruction: string = '';

    #buildRows(mode: DoAlchemyMode): BrewRow[] {
        const data: DoAlchemyModalData | undefined = this.modalContext?.data;
        if (!data) return [];

        const rows: BrewRow[] = [];

        // Content type description row
        const hasDescription = !!data.documentTypeDescription?.trim();
        if (mode === 'everything' || !hasDescription) {
            rows.push({
                kind: 'description',
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
                    kind: 'description',
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

    async #startIconBrew() {
        const data = this.modalContext?.data as DoAlchemyModalData | undefined;
        const cacheKey = data?.unique;

        this._rows = [{
            kind: 'icon',
            label: 'Icon',
            contextAlias: 'content-type-icons',
            targetPropertyAlias: null,
            status: 'brewing',
            result: null,
        }];
        this._phase = 'brewing';

        const prompt = `Pick the best icon for the "${data?.documentTypeName ?? 'content type'}" document type`;

        const result = await callBrewApi(
            this as unknown as HTMLElement,
            prompt,
            'content-type-icons',
            cacheKey,
        );

        this._rows[0].status = result ? 'done' : 'error';
        this._rows[0].result = result ?? 'Failed to generate';
        this._rows = [...this._rows];
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

            // Apply brewed results
            for (const row of this._rows) {
                if (row.status !== 'done' || !row.result) continue;

                if (row.kind === 'icon') {
                    // Icon — strip any accidental whitespace / quotes
                    model.icon = row.result.trim();
                } else if (!row.targetPropertyAlias) {
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
        const currentIcon = data?.icon;

        const hasDocDesc = !!data?.documentTypeDescription?.trim();
        const filledProps = data?.properties.filter((p) => !!p.description?.trim()) ?? [];
        const blankProps = data?.properties.filter((p) => !p.description?.trim()) ?? [];

        return html`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${data?.documentTypeName ?? 'this content type'}</strong>.
                </p>
                <div class="overview">
                    <div class="overview-row">
                        <span class="overview-label">Description</span>
                        ${hasDocDesc
                            ? html`<span class="overview-filled">✓</span>`
                            : html`<span class="overview-blank">✗ blank</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Icon</span>
                        ${currentIcon
                            ? html`<span class="overview-filled"><uui-icon name="${currentIcon.split(' ')[0]}"></uui-icon> ${currentIcon.split(' ')[0]}</span>`
                            : html`<span class="overview-blank">✗ none</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Properties</span>
                        <span>
                            ${filledProps.length > 0
                                ? html`<span class="overview-filled">${filledProps.length} filled</span>`
                                : ''}
                            ${filledProps.length === 0 && blankProps.length === 0
                                ? html`<span class="overview-blank">none</span>`
                                : ''}
                        </span>
                    </div>
                    ${blankProps.length > 0
                        ? html`<div class="overview-blank-list">
                            <span class="overview-blank">${blankProps.length} blank:</span>
                            ${blankProps.map((p) => html`<span class="overview-blank-item">${p.name || p.alias}</span>`)}
                        </div>`
                        : ''}
                </div>
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
                    <uui-button
                        look="outline"
                        label="Brew An Icon"
                        @click=${() => this.#startIconBrew()}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew An Icon
                        ${currentIcon
                            ? html`<small class="current-icon">Current: <uui-icon name="${currentIcon.split(' ')[0]}"></uui-icon></small>`
                            : ''}
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

    #onResultEdit(row: BrewRow, e: Event) {
        const target = e.target as HTMLTextAreaElement;
        row.result = target.value;
    }

    async #rebrew(row: BrewRow) {
        const cacheKey = (this.modalContext?.data as DoAlchemyModalData | undefined)?.unique;
        const previousResult = row.result ?? '';
        const instruction = this._rebrewInstruction.trim();

        // Close the adjustment input
        this._rebrewRow = null;
        this._rebrewInstruction = '';

        row.status = 'brewing';
        row.result = null;
        this._rows = [...this._rows];

        let basePrompt: string;
        if (row.kind === 'icon') {
            basePrompt = `Pick the best icon for the "${(this.modalContext?.data as DoAlchemyModalData | undefined)?.documentTypeName ?? 'content type'}" document type`;
        } else if (row.targetPropertyAlias) {
            basePrompt = `Write a description for the "${row.label}" property`;
        } else {
            basePrompt = `Write a description for this content type`;
        }

        // If there's a previous result and/or adjustment, structure the prompt
        // so even a simple model knows what to do.
        let prompt = basePrompt;
        if (instruction && previousResult) {
            prompt = `${basePrompt}\n\nYou previously wrote:\n${previousResult}\n\nThe user wants this adjustment:\n${instruction}`;
        } else if (instruction) {
            prompt = `${basePrompt}\n\nAdditional instruction:\n${instruction}`;
        }

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

    #openRebrewInput(row: BrewRow) {
        this._rebrewRow = row;
        this._rebrewInstruction = '';
    }

    #cancelRebrew() {
        this._rebrewRow = null;
        this._rebrewInstruction = '';
    }

    #onRebrewKeydown(row: BrewRow, e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.#rebrew(row);
        } else if (e.key === 'Escape') {
            this.#cancelRebrew();
        }
    }

    #renderStatus(row: BrewRow) {
        const isAdjusting = this._rebrewRow === row;
        switch (row.status) {
            case 'pending':
                return html`<span class="status-pending">Waiting…</span>`;
            case 'brewing':
                return html`<span class="status-brewing"><uui-loader-circle></uui-loader-circle> Brewing…</span>`;
            case 'done':
                if (row.kind === 'icon' && row.result) {
                    return html`<div class="result-col">
                        <div class="result-row">
                            <span class="status-done icon-result"><uui-icon name="${row.result}"></uui-icon> ${row.result}</span>
                            <uui-button compact look="default" label="Rebrew" @click=${() => isAdjusting ? this.#rebrew(row) : this.#openRebrewInput(row)}>
                                <uui-icon name="alchemy-brew-bottle"></uui-icon>
                            </uui-button>
                        </div>
                        ${isAdjusting ? this.#renderRebrewInput(row) : ''}
                    </div>`;
                }
                return html`<div class="result-col">
                    <div class="result-row">
                        <textarea
                            class="result-edit"
                            .value=${row.result ?? ''}
                            @input=${(e: Event) => this.#onResultEdit(row, e)}
                            rows="2"></textarea>
                        <uui-button compact look="default" label="Rebrew" @click=${() => isAdjusting ? this.#rebrew(row) : this.#openRebrewInput(row)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${isAdjusting ? this.#renderRebrewInput(row) : ''}
                </div>`;
            case 'error':
                return html`<div class="result-col">
                    <div class="result-row">
                        <span class="status-error">Failed to generate</span>
                        <uui-button compact look="default" label="Retry" @click=${() => isAdjusting ? this.#rebrew(row) : this.#openRebrewInput(row)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${isAdjusting ? this.#renderRebrewInput(row) : ''}
                </div>`;
        }
    }

    #renderRebrewInput(row: BrewRow) {
        return html`<div class="rebrew-input">
            <input
                type="text"
                class="rebrew-text"
                placeholder="Describe your adjustment… (Enter to brew, Esc to cancel)"
                .value=${this._rebrewInstruction}
                @input=${(e: Event) => { this._rebrewInstruction = (e.target as HTMLInputElement).value; }}
                @keydown=${(e: KeyboardEvent) => this.#onRebrewKeydown(row, e)}
            />
            <uui-button compact look="primary" label="Brew" @click=${() => this.#rebrew(row)}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
            <uui-button compact look="default" label="Cancel" @click=${() => this.#cancelRebrew()}>
                ✕
            </uui-button>
        </div>`;
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

            .overview {
                display: flex;
                flex-direction: column;
                gap: 2px;
                margin-bottom: var(--uui-size-space-4, 12px);
                padding: var(--uui-size-space-3, 8px) var(--uui-size-space-4, 12px);
                background: var(--uui-color-surface-alt, #f3f3f5);
                border-radius: var(--uui-border-radius, 3px);
                font-size: var(--uui-type-small-size, 12px);
            }

            .overview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .overview-label {
                opacity: 0.7;
            }

            .overview-filled {
                color: var(--uui-color-positive, #2bc37c);
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .overview-filled uui-icon {
                font-size: 14px;
            }

            .overview-blank {
                color: var(--uui-color-danger, #d42054);
                opacity: 0.8;
            }

            .overview-blank-list {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                align-items: center;
                margin-top: 2px;
            }

            .overview-blank-item {
                background: var(--uui-color-danger, #d42054);
                color: var(--uui-color-surface, #fff);
                border-radius: 3px;
                padding: 1px 6px;
                font-size: 11px;
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

            .result-edit {
                width: 100%;
                box-sizing: border-box;
                color: var(--uui-color-positive, #2bc37c);
                background: transparent;
                border: 1px solid var(--uui-color-border, #d8d7d9);
                border-radius: var(--uui-border-radius, 3px);
                padding: var(--uui-size-space-2, 4px) var(--uui-size-space-3, 8px);
                font-family: inherit;
                font-size: inherit;
                line-height: 1.4;
                resize: vertical;
                field-sizing: content;
            }

            .result-edit:focus {
                outline: none;
                border-color: var(--uui-color-focus, #3544b1);
            }

            .result-row {
                display: flex;
                align-items: flex-start;
                gap: 4px;
            }

            .result-row textarea {
                flex: 1;
            }

            .result-row uui-button {
                flex-shrink: 0;
                margin-top: 2px;
            }

            .result-col {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .rebrew-input {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .rebrew-text {
                flex: 1;
                border: 1px solid var(--uui-color-border, #d8d7d9);
                border-radius: var(--uui-border-radius, 3px);
                padding: var(--uui-size-space-1, 3px) var(--uui-size-space-3, 8px);
                font-family: inherit;
                font-size: var(--uui-type-small-size, 12px);
                background: transparent;
                color: inherit;
            }

            .rebrew-text:focus {
                outline: none;
                border-color: var(--uui-color-focus, #3544b1);
            }

            .rebrew-text::placeholder {
                opacity: 0.5;
            }

            .icon-result {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .icon-result uui-icon {
                font-size: 24px;
            }

            .current-icon {
                opacity: 0.6;
                margin-left: 4px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
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
