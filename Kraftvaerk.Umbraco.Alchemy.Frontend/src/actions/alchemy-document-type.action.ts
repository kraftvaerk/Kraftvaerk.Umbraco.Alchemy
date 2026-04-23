import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UmbDocumentTypeDetailRepository } from '@umbraco-cms/backoffice/document-type';
import { DO_ALCHEMY_MODAL } from '../alchemy-do-alchemy.modal-token.js';
import { pushPropertyContextToCache } from '../alchemy-brew.collect-property-context.js';
import type { BrewPropertyInfo } from '../api/types.gen.js';

export class AlchemyDocumentTypeAction extends UmbEntityActionBase<never> {

    async execute() {
        const unique = this.args.unique;
        if (!unique) return;

        // Fetch document type details via repository (no workspace context needed)
        const repo = new UmbDocumentTypeDetailRepository(this);
        const { data: model } = await repo.requestByUnique(unique);
        if (!model) return;

        const containers = model.containers ?? [];
        const containerMap = new Map(containers.map((c) => [c.id, c]));

        const properties: BrewPropertyInfo[] = (model.properties ?? []).map((p) => {
            const c = p.container?.id ? containerMap.get(p.container.id) : undefined;
            return {
                name: p.name ?? '',
                alias: p.alias ?? '',
                description: p.description ?? null,
                containerName: c?.name ?? null,
                containerType: c?.type ?? null,
            };
        });

        const documentTypeName = model.name ?? '';
        const documentTypeDescription = model.description ?? null;

        // Push property context to backend cache so brew API can use it
        await pushPropertyContextToCache(this as unknown as HTMLElement, unique, {
            documentTypeName,
            documentTypeAlias: model.alias ?? null,
            documentTypeDescription,
            isElementType: model.isElement ?? false,
            targetPropertyAlias: '',
            allProperties: properties,
        });

        // Open modal
        const modalManager = await this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, () => {}).asPromise();
        modalManager?.open(this, DO_ALCHEMY_MODAL, {
            data: {
                unique,
                documentTypeName,
                documentTypeDescription,
                icon: model.icon ?? null,
                properties,
            },
        });
    }
}

export default AlchemyDocumentTypeAction;
