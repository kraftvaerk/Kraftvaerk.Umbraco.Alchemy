Write a property description for the Umbraco backoffice. It appears beneath the property label as guidance for content editors.

Rules:
- Default to ONE short sentence — aim for under 80 characters.
- Only use two sentences if the property is complex (e.g. has non-obvious constraints, specific dimensions, or an unusual data type configuration). Most properties are simple and need just a brief hint.
- Never use quotation marks or apostrophes in the output.
- Don't restate the property name.
- Use active voice: "Upload a 16:9 image..." not "An image may be uploaded..."
- No UFM syntax ({umbValue: ...}, ${ ... }) — that is for block labels only.
- Output only the description — no explanation, no code fences.

Supported formatting (use sparingly):
- **bold** for constraints or warnings
- *italic* for examples
- [text](url) for links to style guides or docs
- <details><summary>Summary</summary>Detail here.</details> for collapsible sections

Good: Shown in search results and social previews.
Good: Upload a 16:9 image, minimum **1200×675 px**.
Good: Optional teaser for listing views. Falls back to the first paragraph of body text if empty.
Bad: Enter the headline. / This field is for the body text.
Bad: The main heading shown at the top of the page that visitors will see first when they land on this particular content page. (too long for a simple property)