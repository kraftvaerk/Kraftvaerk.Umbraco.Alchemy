import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { ALCHEMY_BREW_MODAL } from './alchemy-brew.modal-token.js';
import type { AlchemyBrewModalData } from './alchemy-brew.modal-token.js';

/**
 * Opens the Alchemy Brew modal from any Umbraco element (elements that extend
 * UmbLitElement / UmbElementMixin will have `getContext` available).
 *
 * @param host   - The host element used to traverse the context hierarchy.
 * @param data   - Optional prompts and context string for the modal.
 * @returns      The prompt string the user confirmed, or `undefined` if cancelled.
 */
export async function openBrewModal(
    host: HTMLElement,
    data: AlchemyBrewModalData = {},
): Promise<string | undefined> {
    const manager = await (host as any).getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!manager) return undefined;

    try {
        const handler = manager.open(host, ALCHEMY_BREW_MODAL, { data });
        const value = await handler.onSubmit();
        return value?.prompt;
    } catch {
        // User cancelled — not an error
        return undefined;
    }
}
