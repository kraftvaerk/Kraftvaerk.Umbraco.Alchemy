import { html, css, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/property-type';
import { openBrewModal } from '../alchemy-brew.open.js';
import { callBrewApi } from '../alchemy-brew.call-api.js';
import { getDocTypeGuidFromUrl, pushPropertyContextToCache } from '../alchemy-brew.collect-property-context.js';
import type { AlchemyPropertyDescriptionContext, AlchemyPropertyInfo } from '../alchemy-brew.collect-property-context.js';
import { attachHoldBehaviour, injectHoldStyles } from '../alchemy-brew.hold.js';

// This module is imported only after customElements.whenDefined() resolves for
// umb-property-type-workspace-view-settings, so the base class is guaranteed
// to be present. We capture render and styles from the prototype before class
// definition because TypeScript does not allow `super` as a standalone
// expression inside tagged template literals.
type HTMLElementConstructor = new (...args: any[]) => HTMLElement;
const Base = customElements.get('umb-property-type-workspace-view-settings') as unknown as HTMLElementConstructor;
const baseRender: (this: HTMLElement) => unknown = (Base as any).prototype.render;
const baseStyles = (Base as any).styles ?? [];

@customElement('umb-alchemy-property-type-settings')
export class AlchemyPropertyTypeSettingsElement extends Base {
    connectedCallback() {
        super.connectedCallback?.();
        console.log('[Alchemy] property-type-settings connectedCallback fired');
        // Push property context to backend cache as soon as we mount —
        // this element CAN resolve the workspace context, so we do it
        // eagerly so design-editor-property buttons can use it later.
        this.#pushContextToCache();
    }

    async #pushContextToCache() {
        console.log('[Alchemy] #pushContextToCache called');
        const cacheKey = getDocTypeGuidFromUrl();
        console.log('[Alchemy] cacheKey from URL:', cacheKey);
        if (!cacheKey) return;
        try {
            const propWsCtx = await (this as any).getContext?.(UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT);
            console.log('[Alchemy] propWsCtx:', propWsCtx);
            const propData = propWsCtx?.getData?.();
            console.log('[Alchemy] propData:', propData);
            const workspaceCtx = propWsCtx?.structure;
            console.log('[Alchemy] workspaceCtx (structure):', workspaceCtx);
            let model = workspaceCtx?.getOwnerContentType?.();
            if (!model) {
                console.log('[Alchemy] model not ready, awaiting whenLoaded...');
                await workspaceCtx?.whenLoaded?.();
                model = workspaceCtx?.getOwnerContentType?.();
            }
            console.log('[Alchemy] model:', model);
            if (!model) { console.log('[Alchemy] model is null — aborting cache push'); return; }
            const containers: Array<{ id: string; name: string; type: string }> = model.containers ?? [];
            const containerMap = new Map(containers.map((c: { id: string; name: string; type: string }) => [c.id, c]));
            const allProperties: AlchemyPropertyInfo[] = (model.properties ?? []).map((p: any) => {
                const c = p.container?.id ? containerMap.get(p.container.id) : undefined;
                return {
                    name: p.name ?? '', alias: p.alias ?? '',
                    description: p.description ?? null,
                    containerName: c?.name ?? null, containerType: c?.type ?? null,
                };
            });
            const targetContainer = propData?.container?.id ? containerMap.get(propData.container.id) : undefined;
            const context: AlchemyPropertyDescriptionContext = {
                documentTypeName: model.name ?? '',
                documentTypeDescription: model.description ?? null,
                targetPropertyAlias: propData?.alias ?? '',
                targetPropertyName: propData?.name ?? null,
                targetPropertyContainerName: (targetContainer as any)?.name ?? null,
                targetPropertyContainerType: (targetContainer as any)?.type ?? null,
                allProperties,
            };
            console.log('[Alchemy] pushing context to cache:', { cacheKey, context });
            await pushPropertyContextToCache(this, cacheKey, context);
            console.log('[Alchemy] cache push complete');
        } catch (err) { console.error('[Alchemy] #pushContextToCache error:', err); }
    }

    async #brewDirectly(prompt: string) {
        const input = this.shadowRoot?.querySelector('#description-input') as HTMLInputElement | HTMLTextAreaElement | null;
        if (!input) return;
        const cacheKey = getDocTypeGuidFromUrl();
        const propWsCtx = await (this as any).getContext?.(UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT);
        const propAlias = propWsCtx?.getData?.()?.alias as string | undefined;
        const result = await callBrewApi(this, prompt, 'property-descriptions', cacheKey, propAlias);
        if (result === undefined) return;
        input.value = result;
        input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    }

    private static readonly _PROMPTS = [
        'Write a concise description for this property.',
        'Explain what editors should enter here.',
        'Add a helpful hint for content editors.',
    ];

    async #onBrewClick() {
        const userPrompt = await openBrewModal(this, {
            prompts: AlchemyPropertyTypeSettingsElement._PROMPTS,
        });
        if (userPrompt === undefined) return;
        await this.#brewDirectly(userPrompt);
    }

    updated() {
        // umb-property-layout exposes an action-menu slot that renders inline
        // with the label. We move the brew button there after each render so
        // it sits next to the Description label rather than below the panel.
        const descInput = this.shadowRoot?.querySelector('#description-input');
        const btn = this.shadowRoot?.querySelector('#alchemy-brew-btn');
        if (!descInput || !btn) return;

        const layout = descInput.closest('umb-property-layout');
        if (layout && !layout.contains(btn)) {
            btn.setAttribute('slot', 'action-menu');
            layout.appendChild(btn);
        }

        // Attach hold-to-brew behaviour (idempotent).
        if (this.shadowRoot) injectHoldStyles(this.shadowRoot);
        attachHoldBehaviour(
            btn as HTMLElement,
            () => this.#brewDirectly(AlchemyPropertyTypeSettingsElement._PROMPTS[0]),
        );
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
                    opacity: 0.4;
                    transition: opacity 120ms;
                }
                #alchemy-brew-btn:hover {
                    opacity: 1;
                }
            `,
        ];
    }
}

export default AlchemyPropertyTypeSettingsElement;

declare global {
    interface HTMLElementTagNameMap {
        'umb-alchemy-property-type-settings': AlchemyPropertyTypeSettingsElement;
    }
}
