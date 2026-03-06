import { customElement } from '@umbraco-cms/backoffice/external/lit';
import { injectAlchemyBrewButton } from './alchemy-block-type-workspace-view.element.js';

// This module is imported only after customElements.whenDefined() resolves for
// umb-block-grid-type-workspace-view, so the base class is guaranteed to exist.
type C = new (...args: any[]) => HTMLElement;
const Base = customElements.get('umb-block-grid-type-workspace-view') as unknown as C;
const baseUpdated = (Base as any).prototype.updated as ((changed?: Map<PropertyKey, unknown>) => void) | undefined;

@customElement('umb-alchemy-block-grid-workspace-view')
export class AlchemyBlockGridWorkspaceViewElement extends Base {
    updated(changed?: Map<PropertyKey, unknown>) {
        baseUpdated?.call(this, changed);
        injectAlchemyBrewButton(this);
    }
}

export default AlchemyBlockGridWorkspaceViewElement;

declare global {
    interface HTMLElementTagNameMap {
        'umb-alchemy-block-grid-workspace-view': AlchemyBlockGridWorkspaceViewElement;
    }
}
