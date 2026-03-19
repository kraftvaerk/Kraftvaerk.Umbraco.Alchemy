Write a property description for the Umbraco backoffice. It appears beneath the property label as guidance for content editors.

Rules:
- One or two sentences. Be specific to the property, not generic.
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

Good: The main heading at the top of the page. Keep under 60 characters for search results.
Good: Optional teaser for listing views. Falls back to the first paragraph of body text if empty.
Bad: Enter the headline. / This field is for the body text.