import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { postApiV1KraftvaerkUmbracoAlchemyBrewContextByKey } from './api/sdk.gen.js';
import type { BrewPropertyContext, BrewPropertyInfo } from './api/types.gen.js';

// Re-export generated types under the names other modules already import.
export type { BrewPropertyInfo as AlchemyPropertyInfo, BrewPropertyContext as AlchemyPropertyDescriptionContext };

/**
 * Extracts the document type GUID from the current URL.
 * Umbraco backoffice URLs follow the pattern:
 *   /section/settings/workspace/document-type/edit/<GUID>/...
 * The GUID is always available — even for new document types.
 */
export function getDocTypeGuidFromUrl(): string | undefined {
    // Match a standard UUID pattern in the URL path.
    const match = window.location.pathname.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
    );
    return match?.[1];
}

/**
 * Pushes a property context payload to the backend cache so that elements
 * which cannot resolve the workspace context themselves can still benefit.
 */
export async function pushPropertyContextToCache(
    host: HTMLElement,
    cacheKey: string,
    context: BrewPropertyContext,
): Promise<void> {
    const authContext = await (host as any).getContext(UMB_AUTH_CONTEXT);
    const config = authContext?.getOpenApiConfiguration?.() as
        | { token?: string | (() => Promise<string>) }
        | undefined;

    const token = typeof config?.token === 'function' ? await config.token() : config?.token;

    try {
        await postApiV1KraftvaerkUmbracoAlchemyBrewContextByKey({
            baseUrl: window.location.origin,
            auth: token,
            path: { key: cacheKey },
            body: context,
        });
    } catch (err) {
        console.error('[Alchemy] pushPropertyContextToCache error:', err);
    }
}
