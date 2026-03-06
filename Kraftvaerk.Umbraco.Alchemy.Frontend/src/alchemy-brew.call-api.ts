import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';

/**
 * Calls the Alchemy /brew endpoint and returns the AI-generated text.
 *
 * @param host         - The host element (used to traverse the context hierarchy for auth).
 * @param prompt       - The user's prompt / intent string from the modal.
 * @param contextAlias - Alias of the Umbraco.AI context to inject as a system prompt.
 * @param cacheKey     - Document type GUID used to look up cached property context on the backend.
 * @returns The generated text, or `undefined` if the call failed.
 */
export async function callBrewApi(
    host: HTMLElement,
    prompt: string,
    contextAlias: string,
    cacheKey?: string,
): Promise<string | undefined> {
    // Resolve the Umbraco auth context to get a bearer token.
    const authContext = await (host as any).getContext(UMB_AUTH_CONTEXT);
    const config = authContext?.getOpenApiConfiguration?.() as
        | { token?: string | (() => Promise<string>); credentials?: RequestCredentials }
        | undefined;

    let authHeader: Record<string, string> = {};
    if (config?.token) {
        const raw = typeof config.token === 'function' ? await config.token() : config.token;
        if (raw) authHeader = { Authorization: `Bearer ${raw}` };
    }

    try {
        const res = await fetch('/api/v1/Kraftvaerk.Umbraco.Alchemy/brew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            credentials: config?.credentials ?? 'same-origin',
            body: JSON.stringify({ prompt, contextAlias, cacheKey }),
        });

        if (!res.ok) return undefined;
        const data = (await res.json()) as { result: string };
        // Strip surrounding quotes the model sometimes adds (e.g. "My description").
        return data.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, '').trim();
    } catch {
        return undefined;
    }
}
