# Copilot Instructions

Before responding to any request related to Umbraco backoffice development, always check whether a relevant skill is available in `~/.agents/skills/` and apply it. Available skills cover areas such as dashboards, property editors, workspaces, trees, sections, modals, notifications, context APIs, state management, and more.

If a request relates to any Umbraco backoffice extension type, use the most applicable skill automatically without waiting to be asked.

## Project: Kraftvaerk.Umbraco.Alchemy

A developer-centric AI assistant package for **Umbraco 17** (Bellissima backoffice). The package namespace is `Kraftvaerk.Umbraco.Alchemy`. Frontend project lives in `Kraftvaerk.Umbraco.Alchemy.Frontend`.

### What it does

- **UFM Specialist** — Automates Block List / Block Grid label syntax. Translates human intent into valid UFM expressions, e.g. `${ price } ${ discount ? '🏷️' : '' }`.
- **Property Description Enrichment** — AI-generates GFM help text for property editors and suggests `umbLocalize` keys for multilingual support.
- **"Brewing Potion" UI** — A wand-icon button (`<uui-button compact look="secondary">`) injected next to specific field labels. Clicking it will eventually open a popover to brew and inject AI-generated content directly into the field.

### Brew button injection points

All four targets inject a `<uui-button id="alchemy-brew-btn">` with `<uui-icon name="icon-wand">`. The button fades in on hover (opacity 0.4 → 1). On click it currently writes `"Hello world"` to the target field as a placeholder for the real AI call.

| Target | Where the button appears | Strategy | Element file |
|---|---|---|---|
| Property type slide-out | Next to the **Description** label (`slot="action-menu"` on `umb-property-layout`) | Strategy 2 — manifest swap | `alchemy-property-type-settings.element.ts` |
| Document type header | Inline after the **Description** `<uui-input>`, flex-wrapped | Strategy 3 — prototype patch | `alchemy-content-type-header.element.ts` |
| Design tab property row | Absolute top-right inside the description `<p>` | Strategy 1 — `customElements.define` intercept | `alchemy-design-editor-property.element.ts` |
| Block Grid / Block List type workspace | Next to the **Label** field label, injected into `umb-property-layout` shadow `#headerColumn` | Strategy 2 — manifest swap | `alchemy-block-grid-workspace-view.element.ts` / `alchemy-block-list-workspace-view.element.ts` |

### Interception strategies

- **Strategy 1 — `customElements.define` intercept**: wraps `customElements.define` at module scope to substitute a subclass under the original tag name. Used for elements that are lazy-loaded but have no manifest alias (e.g. `umb-content-type-design-editor-property`).
- **Strategy 2 — manifest swap**: polls `extensionRegistry` for a known alias, waits for `customElements.whenDefined`, then unregisters and re-registers the manifest with our element as `default` export. Used for manifest-registered workspace views where Umbraco calls `new (await manifest.element())()` directly.
- **Strategy 3 — prototype patch**: calls `customElements.get(tag)` and patches `prototype.render` + `prototype.updated` in-place at `onInit` time. Used for eagerly bundled elements already defined before our entry point runs.

### Stack / constraints

- Umbraco 17 only (Bellissima backoffice)
- TypeScript + Lit, imported via `@umbraco-cms/backoffice/external/lit`
- Entry point: `src/index.ts` (`backofficeEntryPoint` manifest type)
- Manifests use `element: () => import(...)` — never the old `js` + `elementName` pattern
- Subclass files capture base class via `customElements.get(tag)` at module scope (never inside the class), and capture prototype methods as `const base* = (Base as any).prototype.method` to avoid TypeScript `super` expression errors
- Re-registered manifests use `weight: existing.weight + 1` to preserve tab order
