# Kraftvaerk.Umbraco.Alchemy

> Using AI to write Umbraco Flavored Markdown labels for blocks and great descriptions for document types and properties.

This package was created for the **Umbraco Spark Package Hackathon** and is a work in progress — scaffolded and ready to be built upon collaboratively. There is no published NuGet package yet.

---

## What it does

Editors spend time writing descriptions for document types and their properties, and UFM label expressions for blocks. Alchemy automates this by placing a **"Brew with AI"** wand button directly in the relevant parts of the Umbraco backoffice:

- **Document type descriptions** - Adds a brew button next to the description field in the document type header.
- **Property descriptions** - Adds a brew button to both the property type settings panel and the inline design editor property row.
- **Block UFM labels** - Adds a brew button to the UFM label field in Block Grid and Block List block type workspaces.

When clicked, a small modal lets the editor choose a predefined prompt or write their own. Alchemy sends the prompt to the AI along with the full document type structure (name, all properties, existing descriptions, group/tab layout) so the suggestion is contextually relevant. The result is inserted directly into the field.

---

## Requirements

| Dependency | Version |
|---|---|
| Umbraco CMS | 17.x |
| .NET | 10 |
| Umbraco.AI | 1.4.x |

---

## How it works

### Backend

A versioned API controller (`BrewController`) is mounted at `/api/v1/Kraftvaerk.Umbraco.Alchemy/brew` and protected by backoffice authentication.

**`POST /brew`** - Accepts a prompt, an optional Umbraco.AI context alias, and optional document type context. Calls the Umbraco.AI chat service and returns the generated text.

Request body:

```json
{
  "prompt": "Write a concise description for this property.",
  "contextAlias": "property-descriptions",
  "cacheKey": "<document-type-guid>",
  "propertyContext": null
}
```

| Field | Description |
|---|---|
| `prompt` | Required. The editor's instruction to the AI. |
| `contextAlias` | Optional. Alias of an Umbraco.AI context to inject as an additional system prompt (e.g. `property-descriptions`, `ufm`). |
| `cacheKey` | Optional. Document type GUID used to look up property context that was previously cached by the frontend. |
| `propertyContext` | Optional. Inline document type context when the frontend can resolve it directly (document type name, all properties, target property). |

**`POST /brew/context/{key}`** - Caches a document type context payload for 24 hours. Needed because some frontend elements (e.g. the inline design editor property row) cannot traverse the workspace context hierarchy themselves.

The controller uses the `gpt4omini` Umbraco.AI profile and falls back to the global default profile if that alias is not configured.

### Frontend

As extensive as the new Umbraco backoffice is, there are currently **no extension points** for what Alchemy is trying to do — injecting additional UI into existing, core-owned elements like the document type header, the property row in the design editor, and the property type settings panel. The extension API covers adding entirely new sections, dashboards, and workspace views, but does not expose hooks for augmenting fields inside existing editors.

> 💡 **Hey Umbraco** — wouldn't it be lovely to have extension points for adding actions next to description fields on document types and properties, and next to the UFM label field on block types? We'd love that. Pretty please! 🙏

To work around this, the frontend uses three strategies depending on how and when each target element is registered:

1. **`customElements.define` interception** — Wraps the global `define` call to substitute an Alchemy subclass for `umb-content-type-design-editor-property` before Umbraco registers it.
2. **Extension registry manifest swap** — Waits for Umbraco to define an element, then re-registers the manifest pointing at the Alchemy subclass. Used for the property type settings panel, Block Grid, and Block List workspace views.
3. **Prototype patching** — Patches `render`/`updated` on the already-registered `umb-content-type-workspace-editor-header` prototype directly, since that element is eagerly bundled and defined before the entry point runs.

A `workspaceContext` extension (`AlchemyDocTypeContextObserver`) is also registered for `Umb.Workspace.DocumentType`. It pushes the full document type property list to the backend cache as soon as the workspace opens, so all brew buttons that need context have it available.

---

## Development

### Prerequisites

- .NET 10 SDK  
- Node.js 20+

### Frontend

```bash
cd Kraftvaerk.Umbraco.Alchemy.Frontend
npm install
npm run build        # production build → ../Kraftvaerk.Umbraco.Alchemy.Backend/ui/
npm run watch        # incremental watch build, copies assets into local Umbraco wwwroot
```

### Backend / local Umbraco

A full Umbraco 17 instance is included under `Umbraco/` for development. Run it with:

```bash
dotnet run --project Kraftvaerk.Umbraco.Alchemy.Backend
```

Default backoffice credentials:

| | |
|---|---|
| Email | admin@example.com |
| Password | 1234567980 |

Backoffice URL: `https://localhost:{port}/umbraco`

### Generating the typed API client

```bash
cd Kraftvaerk.Umbraco.Alchemy.Frontend
npm run generate     # requires the backend to be running
```

---

## Project structure

```
Kraftvaerk.Umbraco.Alchemy.Backend/
│   Composers/ServiceComposer.cs              # DI registrations
│   Controllers/BrewController.cs             # /brew and /brew/context/{key} endpoints
│   buildTransitive/                          # MSBuild props/targets for the package
│   ui/                                       # Compiled frontend assets (embedded in package)
│
Kraftvaerk.Umbraco.Alchemy.Frontend/
│   src/
│     index.ts                                # Entry point; registers extensions & patches elements
│     alchemy-brew.call-api.ts                # Fetch wrapper for the /brew endpoint
│     alchemy-brew.open.ts                    # Opens the brew modal and returns the selected prompt
│     alchemy-brew.collect-property-context.ts # Collects & pushes document type context to backend cache
│     alchemy-doctype-context-observer.ts     # WorkspaceContext controller
│     elements/
│       alchemy-brew-modal.element.ts         # Brew prompt modal (predefined prompts + free text)
│       alchemy-content-type-header.element.ts # Brew button on the document type description field
│       alchemy-design-editor-property.element.ts  # Brew button on inline property rows (Design tab)
│       alchemy-property-type-settings.element.ts  # Brew button in the property type settings panel
│       alchemy-block-grid-workspace-view.element.ts
│       alchemy-block-list-workspace-view.element.ts
│       alchemy-block-type-workspace-view.element.ts  # Shared UFM label brew injection for blocks
│
Umbraco/                                      # Local Umbraco 17 development instance
```

---

## License

See [LICENSE.md](LICENSE.md).

