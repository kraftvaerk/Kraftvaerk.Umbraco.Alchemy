import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';

export interface AlchemyPropertyInfo {
    name: string;
    alias: string;
    description?: string | null;
    containerName?: string | null;
    /** 'Tab' | 'Group' | null */
    containerType?: string | null;
}

export interface AlchemyPropertyDescriptionContext {
    documentTypeName: string;
    documentTypeDescription?: string | null;
    targetPropertyAlias: string;
    targetPropertyName?: string | null;
    targetPropertyContainerName?: string | null;
    targetPropertyContainerType?: string | null;
    allProperties: AlchemyPropertyInfo[];
}

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
    context: AlchemyPropertyDescriptionContext,
): Promise<void> {
    const authContext = await (host as any).getContext(UMB_AUTH_CONTEXT);
    const config = authContext?.getOpenApiConfiguration?.() as
        | { token?: string | (() => Promise<string>); credentials?: RequestCredentials }
        | undefined;

    let authHeader: Record<string, string> = {};
    if (config?.token) {
        const raw = typeof config.token === 'function' ? await config.token() : config.token;
        if (raw) authHeader = { Authorization: `Bearer ${raw}` };
    }

    console.log('[Alchemy] pushPropertyContextToCache: fetching brew/context/', cacheKey);
    const res = await fetch(`/api/v1/Kraftvaerk.Umbraco.Alchemy/brew/context/${encodeURIComponent(cacheKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        credentials: config?.credentials ?? 'same-origin',
        body: JSON.stringify(context),
    }).catch((err) => { console.error('[Alchemy] pushPropertyContextToCache fetch error:', err); return null; });
    console.log('[Alchemy] pushPropertyContextToCache response:', res?.status);
}
