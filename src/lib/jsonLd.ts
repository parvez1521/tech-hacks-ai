/**
 * Serialize a value for safe embedding inside a
 * `<script type="application/ld+json">` block.
 *
 * Mirrors the escaping already applied by the prerender script
 * (`scripts/prerender-site.mjs`): every `<` is replaced with
 * `\u003c` so a value containing `</script>` (or any other tag)
 * in a name/description cannot break out of the JSON-LD block.
 * The output remains valid JSON — `\u003c` decodes back to `<`
 * when parsed.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
