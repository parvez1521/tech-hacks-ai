/**
 * Response-shape handling for `puter.ai.chat()`.
 *
 * The official Puter docs use the reply as a plain string
 * (`puter.print(response)`), but the SDK may resolve an object instead, so
 * the text is extracted defensively: string, `{ text }`,
 * `{ message: { content } }` (string or an array of `{ text }` parts).
 * Anything else yields '' and the caller reports an honest empty-reply error.
 */
export type PuterChatResponse =
  | string
  | { message?: { content?: string | Array<{ text?: string }> | null } | null; text?: string | null }
  | null
  | undefined;

export function extractChatText(response: PuterChatResponse): string {
  if (typeof response === 'string') return response;
  if (response && typeof response === 'object') {
    if (typeof response.text === 'string' && response.text) return response.text;
    const content = response.message?.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('');
    }
  }
  return '';
}
