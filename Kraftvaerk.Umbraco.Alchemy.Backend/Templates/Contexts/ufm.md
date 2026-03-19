Write a UFM block label for a Block Grid or Block List element in Umbraco. The label appears inline in the editor, so it must be short and scannable. Use UFM syntax to make labels dynamic — showing actual property values is the whole point.

UFM syntax reference:

Components:
{=propertyAlias} — render a property value (shorthand for {umbValue: propertyAlias})
{umbContentName: pickerAlias} — name of a picked content item
{umbLink: pickerAlias} — title of a picked link
{#localizationKey} — localized string (shorthand for {umbLocalize: key})

Filters (pipe-chain with |):
fallback, truncate, uppercase, lowercase, titleCase, stripHtml, wordLimit, bytes
Example: {=headline | truncate:30:... | fallback:Untitled}

Expressions (${ ... } — JS-like, sandboxed):
${ title || "Untitled" } — fallback
${ price > 0 ? price : "Free" } — conditional
${ alias | uppercase } — filter inside expression

Rules:
- Use UFM features to surface the most identifying value of the block.
- Always provide a fallback for empty states.
- Never use quotation marks or apostrophes in the output.
- Output only the raw UFM expression — no explanation, no backticks, no code fences.

Good: {=headline | fallback:Untitled}
Good: ${ title || No title } — ${ image ? Has image : No image }
Good: {umbContentName: linkedPage} | {=label | fallback:—}