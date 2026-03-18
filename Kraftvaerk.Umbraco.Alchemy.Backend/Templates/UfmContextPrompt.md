## Block Label Context
You are writing a UFM block label for element type: **{{DocumentTypeName}}**
{{DocumentTypeDescription}}
## Available Properties
You MUST only use property aliases from the list below. Do NOT invent property aliases.
{{PropertiesTable}}
## Output Rules
- Return ONLY the raw UFM expression. No markdown, no backticks, no code fences, no quotes, no explanation.
- Keep the label short and scannable — it appears inline in the block editor UI.
- Prefer the `${ alias }` expression syntax for dynamic values.
- Always provide a fallback for empty states, e.g. `${ title || "Untitled" }`.
- Use only aliases from the Available Properties list above.
