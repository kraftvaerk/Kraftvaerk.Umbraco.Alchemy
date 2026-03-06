import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { postApiV1KraftvaerkUmbracoAlchemyBrew } from './api/sdk.gen.js';

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
    const authContext = await (host as any).getContext(UMB_AUTH_CONTEXT);
    const config = authContext?.getOpenApiConfiguration?.() as
        | { token?: string | (() => Promise<string>) }
        | undefined;

    const token = typeof config?.token === 'function' ? await config.token() : config?.token;

    try {
        const { data } = await postApiV1KraftvaerkUmbracoAlchemyBrew({
            baseUrl: window.location.origin,
            auth: token,
            body: { prompt, contextAlias, cacheKey },
        });
        if (!data?.result) return undefined;
        // Strip surrounding quotes the model sometimes adds (e.g. "My description").
        return data.result.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/gu, '').trim();
    } catch {
        return undefined;
    }
}
