import type { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import type { UmbExtensionRegistry, ManifestBase, UmbConditionConfigBase } from '@umbraco-cms/backoffice/extension-api';

// ─── Strategy 1: customElements.define interception ─────────────────────────
//
// For lazy-loaded elements that have no interceptable manifest alias we wrap
// customElements.define so we can substitute our own subclass under the same
// tag name at the moment Umbraco first registers each element.
//   · umb-content-type-design-editor-property  (inline property row, Design tab)

const DESIGN_PROPERTY_TAG = 'umb-content-type-design-editor-property';

const _originalDefine = customElements.define.bind(customElements);
(customElements as any).define = function (name: string, ctor: CustomElementConstructor, opts?: ElementDefinitionOptions) {
    if (name === DESIGN_PROPERTY_TAG) {
        import('./elements/alchemy-design-editor-property.element.js').then(({ createAlchemyDesignEditorPropertyClass }) => {
            const AlchemyClass = createAlchemyDesignEditorPropertyClass(ctor as any);
            _originalDefine(name, AlchemyClass as unknown as CustomElementConstructor, opts);
        });
        return;
    }
    _originalDefine(name, ctor, opts);
};

// ─── Strategy 2: Extension registry manifest swap ────────────────────────────
//
// For lazily-loaded elements registered via an extension manifest we poll until
// Umbraco registers the manifest, trigger the original element loader so the
// base class is defined, then swap the manifest's element factory to ours.

type ExtRegistry = UmbExtensionRegistry<ManifestBase, UmbConditionConfigBase<string>, ManifestBase>;

function swapManifestElement(
    extensionRegistry: ExtRegistry,
    alias: string,
    tag: string,
    elementLoader: () => Promise<unknown>,
) {
    setTimeout(async () => {
        const existing = extensionRegistry.getByAlias(alias);

        if (!existing) {
            swapManifestElement(extensionRegistry, alias, tag, elementLoader);
            return;
        }

        const existingAsAny = existing as any;
        if (typeof existingAsAny.element === 'function') {
            await existingAsAny.element();
        }

        await customElements.whenDefined(tag);
        await elementLoader();

        extensionRegistry.unregister(alias);
        extensionRegistry.register({
            ...existing,
            element: elementLoader,
            weight: ((existing as any).weight ?? 0) + 1,
        } as any);
    }, 200);
}

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    // Register the Brew modal
    extensionRegistry.register({
        type: 'modal',
        alias: 'alchemy.modal.brew',
        name: 'Alchemy Brew Modal',
        element: () => import('./elements/alchemy-brew-modal.element.js'),
    } as any);

    // Property type workspace — description field
    swapManifestElement(
        extensionRegistry,
        'Umb.WorkspaceView.PropertyType.Settings',
        'umb-property-type-workspace-view-settings',
        () => import('./elements/alchemy-property-type-settings.element.js'),
    );

    // Block Grid type workspace — UFM label field
    swapManifestElement(
        extensionRegistry,
        'Umb.WorkspaceView.BlockType.Grid.Settings',
        'umb-block-grid-type-workspace-view',
        () => import('./elements/alchemy-block-grid-workspace-view.element.js'),
    );

    // Block List type workspace — UFM label field
    swapManifestElement(
        extensionRegistry,
        'Umb.WorkspaceView.BlockType.List.Settings',
        'umb-block-list-type-workspace-view-settings',
        () => import('./elements/alchemy-block-list-workspace-view.element.js'),
    );

    // ─── Strategy 4: workspaceContext extension ──────────────────────────────
    //
    // Registers a proper UmbControllerBase against Umb.Workspace.DocumentType.
    // Umbraco instantiates it with the workspace host element so consumeContext
    // works correctly — no DOM hacks. Pushes the property list to the backend
    // IMemoryCache as soon as the workspace structure is loaded.
    extensionRegistry.register({
        type: 'workspaceContext',
        alias: 'alchemy.workspaceContext.documentType',
        name: 'Alchemy Document Type Context Observer',
        api: () => import('./alchemy-doctype-context-observer.js'),
        conditions: [
            {
                alias: 'Umb.Condition.WorkspaceAlias',
                match: 'Umb.Workspace.DocumentType',
            },
        ],
    } as any);

    // ─── Strategy 3: Prototype patching ─────────────────────────────────────
    //
    // umb-content-type-workspace-editor-header is eagerly bundled into Umbraco's
    // main chunk and defined before our entry point runs, so the define intercept
    // above fires too late. Instead we patch the prototype directly at init time,
    // before the user navigates to any document type workspace.
    import('./elements/alchemy-content-type-header.element.js').then(({ patchAlchemyContentTypeHeader }) => {
        patchAlchemyContentTypeHeader();
    });
};
