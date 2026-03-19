import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import type { BrewPropertyInfo } from './api/types.gen.js';

export type DoAlchemyMode = 'blanks' | 'everything';

export interface DoAlchemyModalData {
    /** Document type unique id (cache key for property context). */
    unique: string;
    /** Document type name for display. */
    documentTypeName: string;
    /** Document type description (current value). */
    documentTypeDescription: string | null;
    /** Current icon (e.g. "icon-document color-blue"). */
    icon: string | null;
    /** All properties on the document type. */
    properties: BrewPropertyInfo[];
}

export interface DoAlchemyModalValue {
    // No return value — results are displayed inside the modal.
}

export const DO_ALCHEMY_MODAL = new UmbModalToken<DoAlchemyModalData, DoAlchemyModalValue>(
    'alchemy.modal.doAlchemy',
    { modal: { type: 'sidebar', size: 'medium' } },
);
