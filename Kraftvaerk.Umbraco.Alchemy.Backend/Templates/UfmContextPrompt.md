## Block Label Context
You are writing a UFM block label for element type: **{{DocumentTypeName}}**
{{DocumentTypeDescription}}
## Available Properties
You MUST only use property aliases from the list below. Do NOT invent property aliases.
{{PropertiesTable}}
## Output Rules
- ALWAYS prefix the label with the block name: **{{DocumentTypeName}}: **  followed by the dynamic part.
- Pick only ONE property — the single most identifying value. Only use TWO if the block clearly has two short, complementary fields. NEVER more than two.
- Return ONLY the raw UFM expression. No markdown, no backticks, no code fences, no quotes, no explanation.
- Keep the label short and scannable — it appears inline in the block editor UI.
- Prefer the `${ alias }` expression syntax for dynamic values.
- Always provide a fallback for empty states, e.g. `${ title || "Untitled" }`.
- Use only aliases from the Available Properties list above.
