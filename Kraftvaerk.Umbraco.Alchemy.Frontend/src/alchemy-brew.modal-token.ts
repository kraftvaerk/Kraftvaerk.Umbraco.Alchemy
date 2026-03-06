import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface AlchemyBrewModalData {
    /**
     * 1–3 predefined prompt strings shown as clickable buttons at the top of
     * the modal. Clicking one immediately submits the modal with that prompt.
     */
    prompts?: string[];
    /**
     * Optional context string passed to the AI call. Not displayed in the UI.
     */
    context?: string;
}

export interface AlchemyBrewModalValue {
    /** The prompt string the user confirmed (typed or selected). */
    prompt: string;
}

export const ALCHEMY_BREW_MODAL = new UmbModalToken<AlchemyBrewModalData, AlchemyBrewModalValue>(
    'alchemy.modal.brew',
    { modal: { type: 'dialog' } },
);
