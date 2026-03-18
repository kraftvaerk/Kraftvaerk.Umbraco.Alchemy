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
