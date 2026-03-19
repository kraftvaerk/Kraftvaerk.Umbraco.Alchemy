# Umbraco Alchemy

> AI-powered writing assistant for the Umbraco backoffice — generates UFM block labels, document type descriptions, property descriptions, and content type icons so you don't have to.

---

## Installation

```bash
dotnet add package Kraftvaerk.Umbraco.Alchemy
```

Alchemy requires [Umbraco.AI](https://www.nuget.org/packages/Umbraco.AI) with at least one AI provider configured (e.g. `Umbraco.AI.OpenAI`).

| Dependency | Version |
|---|---|
| Umbraco CMS | 17+ |
| Umbraco.AI | 1.6+ |

---

## What it does

Developers spend time writing descriptions for document types and their properties, crafting UFM label expressions for blocks, and choosing icons for content types. Alchemy automates all of this by placing **"Brew with AI"** wand buttons directly in the Umbraco backoffice:

- **Document type descriptions** — Brew button next to the description field in the document type header.
- **Property descriptions** — Brew button in the property type settings panel and on inline property rows in the Design tab.
- **Block UFM labels** — Brew button next to the label field in Block Grid and Block List block type workspaces.
- **Content type icons** — AI-suggested icon selection based on the content type name and structure.

**Click** the wand to open a modal with predefined prompts and a free-text option. **Hold** the wand to fire the default prompt instantly. Alchemy sends the full document type context (name, properties, groups, existing descriptions) to the AI so every suggestion is contextually relevant. The result is written directly into the field.

---

## Configuration

Alchemy works out of the box once Umbraco.AI is configured with a chat profile. Optionally, you can customise behaviour in `appsettings.json`:

```json
{
  "Alchemy": {
    "ChatProfileAlias": null,
    "ExperimentalButtons": false,
    "Contexts": {
      "UfmWriter": "ufm",
      "ContentTypeDescriptionWriter": "document-type-descriptions",
      "PropertyTypeDescriptionWriter": "property-descriptions",
      "ContentTypeIconWriter": "content-type-icons"
    }
  }
}
```

| Setting | Default | Description |
|---|---|---|
| `ChatProfileAlias` | `null` | Alias of the Umbraco.AI chat profile to use. When `null`, the default chat profile is used. **Required** if no default chat profile is configured in Umbraco.AI. |
| `ExperimentalButtons` | `false` | Enables experimental inline brew buttons on property editors and content type headers. |
| `Contexts.UfmWriter` | `"ufm"` | Umbraco.AI context alias for UFM block label generation. |
| `Contexts.ContentTypeDescriptionWriter` | `"document-type-descriptions"` | Context alias for document type description generation. |
| `Contexts.PropertyTypeDescriptionWriter` | `"property-descriptions"` | Context alias for property description generation. |
| `Contexts.ContentTypeIconWriter` | `"content-type-icons"` | Context alias for content type icon selection. |

### Umbraco.AI contexts

Alchemy seeds default Umbraco.AI contexts on first run via a migration plan, so you get working system prompts for each feature out of the box. You can customise or replace these contexts in the Umbraco.AI backoffice at any time.

---

## License

MIT — see [LICENSE.md](LICENSE.md).

