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

IMPORTANT — When to apply filters:
Check the Editor Type column in the Available Properties table. Apply filters based on editor type:
- Umbraco.RichText → MUST use stripHtml then truncate or wordLimit, e.g. {=alias | stripHtml | truncate:30:... | fallback:—}
- Umbraco.TextArea → MUST use truncate or wordLimit, e.g. {=alias | truncate:30:... | fallback:—}
- Umbraco.TextBox → MUST use truncate or wordLimit, e.g. {=alias | truncate:30:... | fallback:—}
- Umbraco.MarkdownEditor → MUST use stripHtml then truncate or wordLimit
If the Editor Type contains "Rich" or "Markdown", always apply stripHtml BEFORE truncate.
When in doubt, apply filters. Labels MUST be short.

Expressions (${ ... } — JS-like, sandboxed):
${ title || "Untitled" } — fallback
${ price > 0 ? price : "Free" } — conditional
${ alias | uppercase } — filter inside expression

Rules:
- ALWAYS prefix the label with the block name followed by a colon and a space. The block name is provided in the Block Label Context. If the block name ends with "Block" (e.g. "Header Block", "RTE Block"), drop the trailing "Block" and any preceding space from the prefix. For example, "Header Block" becomes "Header:", "RTE Block" becomes "RTE:".
- Pick only ONE property to display in the label — the single most identifying value of the block.
- Only use TWO properties if the block clearly has two short, complementary identifying fields (e.g. a title and a date). Never use more than two.
- Always provide a fallback for empty states.
- Never use quotation marks or apostrophes in the output.
- Output only the raw UFM expression — no explanation, no backticks, no code fences.

Good (block name = Hero): Hero: {=headline | fallback:Untitled}
Good (block name = RTE): RTE: {=richText | stripHtml | wordLimit:5 | fallback:No content}
Good (block name = Article): Article: {=bodyText | stripHtml | truncate:30:... | fallback:Empty}
Good (block name = Card): Card: {=description | truncate:25:... | fallback:—}
Good (block name = Event, two fields justified): Event: {=title | fallback:Untitled} — {=date | fallback:No date}
Bad: Quote: {=author | fallback:—} — {=text | fallback:—} — {=source | fallback:—} (too many properties)