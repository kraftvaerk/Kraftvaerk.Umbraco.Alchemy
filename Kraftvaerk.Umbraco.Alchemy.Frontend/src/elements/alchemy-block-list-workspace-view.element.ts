import { customElement } from '@umbraco-cms/backoffice/external/lit';
import { injectAlchemyBrewButton } from './alchemy-block-type-workspace-view.element.js';

// This module is imported only after customElements.whenDefined() resolves for
// umb-block-list-type-workspace-view-settings, so the base class is guaranteed to exist.
type C = new (...args: any[]) => HTMLElement;
const Base = customElements.get('umb-block-list-type-workspace-view-settings') as unknown as C;
const baseUpdated = (Base as any).prototype.updated as ((changed?: Map<PropertyKey, unknown>) => void) | undefined;

@customElement('umb-alchemy-block-list-workspace-view')
export class AlchemyBlockListWorkspaceViewElement extends Base {
    updated(changed?: Map<PropertyKey, unknown>) {
        baseUpdated?.call(this, changed);
        injectAlchemyBrewButton(this);
    }
}

export default AlchemyBlockListWorkspaceViewElement;

declare global {
    interface HTMLElementTagNameMap {
        'umb-alchemy-block-list-workspace-view': AlchemyBlockListWorkspaceViewElement;
    }
}
