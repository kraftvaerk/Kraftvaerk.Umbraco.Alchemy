# Alchemy Agent Catchup

## What is this project?
An AI assistant package for **Umbraco 17** (Bellissima backoffice). It injects "Brew" buttons (wand icon) into the backoffice that call an LLM to generate content — property descriptions, document type descriptions, and UFM block labels.

## Architecture

### Frontend (`Kraftvaerk.Umbraco.Alchemy.Frontend/`)
- **Stack**: TypeScript + Lit, entry point `src/index.ts` (backofficeEntryPoint manifest)
- **Three interception strategies** to inject brew buttons into Umbraco's existing elements:
  1. `customElements.define` intercept — for lazy-loaded elements with no manifest alias (design-editor-property)
  2. Manifest swap — polls extensionRegistry, swaps manifest element factory (property-type-settings, block workspace views)
  3. Prototype patch — patches `render`/`updated` on already-defined classes (content-type-header)

### Backend (`Kraftvaerk.Umbraco.Alchemy.Backend/`)
- **BrewController** — two endpoints:
  - `POST /brew` — sends prompt to LLM with optional Umbraco.AI context + property context
  - `POST /brew/context/{key}` — caches property context in IMemoryCache for elements that can't resolve workspace context
- **Prompt templates** (embedded resources in `Templates/`):
  - `PropertyContextPrompt.md` — for property/doctype descriptions
  - `UfmContextPrompt.md` — for UFM block labels (constrains LLM to actual property aliases)

## Key shared modules (src/)
| Module | Purpose |
|--------|---------|
| `alchemy-brew.call-api.ts` | Calls `/brew` endpoint with auth, prompt, contextAlias, cacheKey, targetPropertyAlias |
| `alchemy-brew.open.ts` | Opens the brew modal via Umbraco's modal manager |
| `alchemy-brew.hold.ts` | Press-and-hold (1s) on any brew button skips the modal and uses the first prompt directly. Animated border charge + pulse. |
| `alchemy-brew.collect-property-context.ts` | Extracts doctype GUID from URL, pushes property context to backend cache |
| `alchemy-doctype-context-observer.ts` | Workspace context extension that observes `wsCtx.unique` and re-pushes property context on every SPA navigation |

## Brew button injection points
| Target | Context alias | Cache key source | Element file |
|--------|--------------|-----------------|--------------|
| Document type header description | `document-type-descriptions` | URL GUID | `alchemy-content-type-header.element.ts` |
| Property type slide-out description | `property-descriptions` | URL GUID + propAlias | `alchemy-property-type-settings.element.ts` |
| Design tab property row description | `property-descriptions` | URL GUID + propAlias | `alchemy-design-editor-property.element.ts` |
| Block Grid/List label field | `ufm` | `contentElementTypeKey` from block workspace context | `alchemy-block-type-workspace-view.element.ts` |

## Recent changes (this session)
1. **Cache key fix for content-type-header** — was missing `getDocTypeGuidFromUrl()` in `callBrewApi` call
2. **SPA navigation support** — observer now uses `this.observe(wsCtx.unique, ...)` instead of one-shot push, so context is re-cached when navigating between document types without page reload
3. **isElementType** — added to `BrewPropertyContext` (C# + TS). Prompt tells LLM to say "block" vs "page" accordingly
4. **document-type-descriptions context** — content-type-header now uses its own context alias instead of sharing `property-descriptions`
5. **targetPropertyAlias in request** — brew API now accepts property alias directly in the request body; backend merges it into the cached context to specialise per-property
6. **Press-and-hold** — all brew buttons support 1s hold to skip the modal. Animated border charge in Umbraco blue + scale pulse on completion
7. **UFM prompt improvements** — new `UfmContextPrompt.md` template constrains LLM to actual property aliases; block views now pass `contentElementTypeKey` as cache key; modal prompts changed to intent-based language

## Changes added later

### npm run sync-ai (`build/umbraco/sync-ai.js`)
Syncs AI config between Umbraco SQLite databases without booting Umbraco. Finds the DB with the most AI data and replicates to all others. Uses `better-sqlite3` (devDependency).
- Tables synced: Connection → Profile → Context → ContextResource → Guardrail → GuardrailRule → Settings → Agent → Prompt (dependency order)
- **Limitation**: Encrypted `ENC:` connection settings (API keys) are NOT portable. DPAPI discriminates by application content-root path, so identical ciphertext decrypts only in the original Umbraco instance. Use `$` config references in appsettings instead.

### Seed migration (`Migrations/`)
Backend `.cs` migration seeds 3 AI contexts from embedded `.md` resources on first startup:
- `Templates/Contexts/ufm.md` → context alias `ufm`
- `Templates/Contexts/property-descriptions.md` → context alias `property-descriptions`
- `Templates/Contexts/document-type-descriptions.md` → context alias `document-type-descriptions`

Each context gets one resource with the `.md` content. The migration runs on `UmbracoApplicationStartedNotification` (not `Starting`) because Umbraco.AI creates its own tables during the `Starting` phase — our migration needs those tables to exist first.

**Files**:
- `AlchemyMigrationHandler.cs` — notification handler, runs `Upgrader` with plan name `"Alchemy"`
- `SeedAlchemyAIContextsMigration.cs` — `AsyncMigrationBase`, reads embedded resources, inserts into `umbracoAIContext` + `umbracoAIContextResource`

### Options pattern (`Options/AlchemyOptions.cs`)
```
Alchemy: {
  ChatProfileAlias: null | "my-profile",     // null = use default chat profile
  Contexts: {
    UfmWriter: "ufm",                         // AI context alias for UFM labels
    ContentTypeDescriptionWriter: "document-type-descriptions",
    PropertyTypeDescriptionWriter: "property-descriptions"
  }
}
```
- Bound to `"Alchemy"` config section in `ServiceComposer.cs`
- JSON schema at `appsettings-schema.Kraftvaerk.Umbraco.Alchemy.json` (auto-discovered by Umbraco via `.props` file)
- `BrewService` uses `ChatProfileAlias` for profile resolution (falls back to default if null) and `ResolveContextAlias()` to map frontend context aliases to configured overrides

### documentTypeAlias in property context
- Backend: `BrewPropertyContext.DocumentTypeAlias` (nullable string)
- Frontend: `alchemy-doctype-context-observer.ts` reads `model.alias` and includes it in the pushed context
- Observer always `await wsCtx.structure?.whenLoaded?.()` before reading model to prevent stale alias data on SPA navigation

### Entity action: Document Type (`src/actions/`)
- `alchemy-document-type.action.ts` — extends `UmbEntityActionBase<never>`, logs `this.unique` on execute (placeholder for real work)
- Registered in `index.ts` as `ManifestEntityActionDefaultKind` (typed, no `as any`)
- `forEntityTypes: ['document-type']`, `kind: 'default'`, icon `icon-wand`, label `Do Alchemy`
- **Critical**: dynamic import API loaders (`api: () => import(...)`) require a `export default` on the action class — without it Umbraco silently fails to resolve the class from the module

### Data type configuration in prompts (`BrewPromptBuilder`)
The property-context prompt now includes the **data type configuration** (editor alias + serialised config JSON) for the target property. This gives the LLM awareness of allowed values, block types, etc.
- The configuration is fetched via `IDataTypeService.GetAsync` and serialised with `JsonConvert.SerializeObject`
- **GUID substitution**: all GUIDs in the serialised JSON are matched against cached content types and replaced with their human-readable names (so the LLM sees `My Block Element` instead of `a3b2c1d4-...`). Uses `Regex.Replace` with the standard GUID pattern
- Template placeholder: `{{DataTypeConfiguration}}` in `PropertyContextPrompt.md`, placed after `{{TargetPropertyContainer}}`
- `IBrewPromptBuilder.BuildPropertyContextPrompt` is now `async Task<string>` (was `string`) because it awaits the data type service

### Caching content types and data types (`BrewPromptBuilder` + `DataTypeCacheClearNotificationHandler`)
Both `_contentTypeService.GetAll()` and `_dataTypeService.GetAllAsync()` results are cached in `IMemoryCache` to avoid repeated DB calls on every prompt build.
- Cache keys: `BrewPromptBuilder.ContentTypesCacheKey` (`alchemy:contenttypes`) and `BrewPromptBuilder.DataTypesCacheKey` (`alchemy:datatypes`)
- **Content types** are cached as `List<IContentType>` (not a dictionary) so the same cache entry can be used both for GUID-to-Name mapping and for alias-based lookup (replaces the separate `_contentTypeService.Get(alias)` call)
- **Data types** are cached as `Dictionary<Guid, IDataType>` eliminating per-property `GetAsync` calls
- Cache is populated lazily via `_cache.GetOrCreateAsync` (no expiration, lives until evicted)

### Cache invalidation via Umbraco notifications
`DataTypeCacheClearNotificationHandler` (`Notifications/`) implements both:
- `INotificationAsyncHandler<ContentTypeSavedNotification>` evicts `alchemy:contenttypes`
- `INotificationAsyncHandler<DataTypeSavedNotification>` evicts `alchemy:datatypes`

Both handlers are registered in `ServiceComposer.cs` via `builder.AddNotificationAsyncHandler<>`. The handler injects `IMemoryCache` and calls `_cache.Remove(key)`.

## Gotchas for future agents

### Export patterns
- **Manifest swap elements** (`element: () => import(...)`) — work with named exports because the swap code calls the loader and accesses the module itself
- **API loaders** (`api: () => import(...)`) — Umbraco expects the **default export** to be the class. Always add `export default ClassName;`
- **Workspace context extensions** — also use `api: () => import(...)` and need `export default`

### Interception timing
- Strategy 1 (`customElements.define` intercept) runs at **module scope** before `onInit`. It wraps `customElements.define` globally so it catches lazy definitions.
- Strategy 2 (manifest swap) and others run inside `onInit`. The `swapManifestElement` helper polls with `setTimeout(200ms)` until the alias appears.
- Strategy 3 (prototype patch) must import the patcher inside `onInit` (not at top level) because the base class must already be defined.

### Database concerns
- Umbraco.AI tables are prefixed `umbracoAI` (e.g. `umbracoAIContext`, `umbracoAIConnection`)
- DPAPI encryption purpose string: `"Umbraco.AI.SensitiveFields.v1"`
- Encrypted values start with `ENC:` prefix
- Connection settings are stored as JSON in `umbracoAIConnection.Settings` column; sensitive fields within that JSON are individually encrypted

### Build
- `npm run watch` in `PowerShell Extension` terminal handles frontend rebuild
- Backend builds via `dotnet build` from the `.sln`
- Frontend output goes to `wwwroot/App_Plugins/Kraftvaerk.Umbraco.Alchemy/`
