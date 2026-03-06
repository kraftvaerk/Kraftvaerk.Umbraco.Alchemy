import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import {
    getDocTypeGuidFromUrl,
    pushPropertyContextToCache,
} from './alchemy-brew.collect-property-context.js';
import type { AlchemyPropertyInfo, AlchemyPropertyDescriptionContext } from './alchemy-brew.collect-property-context.js';

/**
 * Registered as a `workspaceContext` extension scoped to `Umb.Workspace.DocumentType`.
 * Umbraco instantiates this with the workspace host element, so `consumeContext`
 * works correctly — no DOM hacks needed. It watches the structure context and
 * eagerly pushes the property list to the backend IMemoryCache whenever the
 * document type workspace opens.
 */
export class AlchemyDocTypeContextObserver extends UmbControllerBase {
    readonly #hostEl: HTMLElement;

    constructor(host: UmbControllerHostElement) {
        super(host);
        this.#hostEl = host as unknown as HTMLElement;

        console.log('[Alchemy] AlchemyDocTypeContextObserver constructed');

        this.consumeContext(UMB_WORKSPACE_CONTEXT, (wsCtx: any) => {
            console.log('[Alchemy] workspace context resolved:', wsCtx);
            this.#pushContext(wsCtx);
        });
    }

    async #pushContext(wsCtx: any) {
        const cacheKey = getDocTypeGuidFromUrl();
        console.log('[Alchemy] #pushContext, cacheKey:', cacheKey);
        if (!cacheKey) return;

        try {
            let model = wsCtx.structure?.getOwnerContentType?.();
            if (!model) {
                console.log('[Alchemy] model not ready, awaiting whenLoaded...');
                await wsCtx.structure?.whenLoaded?.();
                model = wsCtx.structure?.getOwnerContentType?.();
            }
            console.log('[Alchemy] model:', model);
            if (!model) { console.log('[Alchemy] model is null — aborting'); return; }

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

            const context: AlchemyPropertyDescriptionContext = {
                documentTypeName: wsCtx.getName?.() ?? model.name ?? '',
                documentTypeDescription: wsCtx.getDescription?.() ?? model.description ?? null,
                targetPropertyAlias: '',
                targetPropertyName: null,
                targetPropertyContainerName: null,
                targetPropertyContainerType: null,
                allProperties,
            };

            console.log('[Alchemy] pushing context to cache:', { cacheKey, properties: allProperties.length });
            await pushPropertyContextToCache(this.#hostEl, cacheKey, context);
            console.log('[Alchemy] cache push done');
        } catch (err) {
            console.error('[Alchemy] #pushContext error:', err);
        }
    }
}

export default AlchemyDocTypeContextObserver;
