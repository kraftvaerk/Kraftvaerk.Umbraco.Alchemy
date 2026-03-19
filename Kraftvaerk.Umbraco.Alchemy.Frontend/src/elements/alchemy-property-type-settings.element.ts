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
        this.#pushContextToCache();
    }

    async #pushContextToCache() {
        const cacheKey = getDocTypeGuidFromUrl();
        if (!cacheKey) return;
        try {
            const propWsCtx = await (this as any).getContext?.(UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT);
            const propData = propWsCtx?.getData?.();
            const workspaceCtx = propWsCtx?.structure;
            let model = workspaceCtx?.getOwnerContentType?.();
            if (!model) {
                await workspaceCtx?.whenLoaded?.();
                model = workspaceCtx?.getOwnerContentType?.();
            }
            if (!model) return;
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
                isElementType: model.isElement ?? false,
                targetPropertyAlias: propData?.alias ?? '',
                targetPropertyName: propData?.name ?? null,
                targetPropertyContainerName: (targetContainer as any)?.name ?? null,
                targetPropertyContainerType: (targetContainer as any)?.type ?? null,
                allProperties,
            };
            await pushPropertyContextToCache(this, cacheKey, context);
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
                look="default"
                compact
                @click=${() => this.#onBrewClick()}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
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
