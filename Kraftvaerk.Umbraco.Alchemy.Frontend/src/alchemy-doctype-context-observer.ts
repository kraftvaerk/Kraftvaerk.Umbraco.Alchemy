import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { postApiV1KraftvaerkUmbracoAlchemyBrewContextByKey } from './api/sdk.gen.js';
import type { AlchemyPropertyInfo, AlchemyPropertyDescriptionContext } from './alchemy-brew.collect-property-context.js';

/**
 * Registered as a `workspaceContext` extension scoped to `Umb.Workspace.DocumentType`.
 * Umbraco instantiates this with the workspace host element, so `consumeContext`
 * works correctly — no DOM hacks needed.
 *
 * Observes `structure.ownerContentType` (an Observable that emits after the
 * content type has been loaded) instead of the `unique` observable — this
 * avoids timing issues where `unique` fires before the data is ready and
 * the one-shot `whenLoaded()` Promise has not yet been wired up during SPA
 * navigation.
 */
export class AlchemyDocTypeContextObserver extends UmbControllerBase {
    #authToken: string | undefined;

    constructor(host: UmbControllerHostElement) {
        super(host);

        // Resolve auth once through the controller's own context chain — this
        // is reliable regardless of whether the host is a DOM element or another
        // controller (workspace API).
        this.consumeContext(UMB_AUTH_CONTEXT, (authCtx: any) => {
            const cfg = authCtx?.getOpenApiConfiguration?.() as
                | { token?: string | (() => Promise<string>) }
                | undefined;
            if (typeof cfg?.token === 'function') {
                cfg.token().then((t: string) => { this.#authToken = t; });
            } else {
                this.#authToken = cfg?.token;
            }
        });

        this.consumeContext(UMB_WORKSPACE_CONTEXT, (wsCtx: any) => {
            this.#observeWorkspace(wsCtx);
        });
    }

    #observeWorkspace(wsCtx: any) {
        const structure = wsCtx.structure;
        if (!structure) return;

        // Observe the actual content type model — fires only after the data
        // has been loaded, so we never race against `whenLoaded()`.
        if (structure.ownerContentType) {
            this.observe(
                structure.ownerContentType,
                (model: any) => {
                    if (!model) return;
                    const cacheKey = wsCtx.getUnique?.() as string | undefined;
                    if (cacheKey) this.#pushContext(wsCtx, cacheKey, model);
                },
                'alchemy-owner-ct',
            );
        }
    }

    async #pushContext(wsCtx: any, cacheKey: string, model: any) {
        try {
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
                documentTypeAlias: model.alias ?? null,
                documentTypeDescription: wsCtx.getDescription?.() ?? model.description ?? null,
                isElementType: model.isElement ?? false,
                targetPropertyAlias: '',
                targetPropertyName: null,
                targetPropertyContainerName: null,
                targetPropertyContainerType: null,
                allProperties,
            };

            // Re-resolve auth token in case the original was a one-time token
            // that has expired (consumeContext keeps authCtx alive).
            let token = this.#authToken;
            if (!token) {
                try {
                    const authCtx = await this.getContext(UMB_AUTH_CONTEXT);
                    const cfg = (authCtx as any)?.getOpenApiConfiguration?.() as
                        | { token?: string | (() => Promise<string>) }
                        | undefined;
                    token = typeof cfg?.token === 'function' ? await cfg.token() : cfg?.token;
                } catch { /* proceed without token — will 401 */ }
            }

            await postApiV1KraftvaerkUmbracoAlchemyBrewContextByKey({
                baseUrl: window.location.origin,
                auth: token,
                path: { key: cacheKey },
                body: context,
            });
        } catch (err) {
            console.error('[Alchemy] #pushContext error:', err);
        }
    }
}

export default AlchemyDocTypeContextObserver;
