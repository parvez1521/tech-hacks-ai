function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isHttpsPromptFeedUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'promptfeed.app' && url.pathname.startsWith('/en/p/');
  } catch {
    return false;
  }
}

export function getPromptFeedSeoMetadata(record) {
  if (!record || typeof record !== 'object' || !String(record.slug || '').startsWith('promptfeed-')) {
    return null;
  }

  const promptTitle = String(record.title || '').trim();
  const targetModel = String(record.targetModel || '').trim();
  const promptText = String(record.promptText || '').trim();
  if (!promptTitle || !targetModel || !promptText) return null;

  const details = String(record.description || 'A reusable prompt recipe with a matching example output.')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    title: `${promptTitle} (${targetModel}) — AI Prompt Recipe — SwitchRoute`,
    description: `${promptTitle} for ${targetModel}: ${details}`.slice(0, 300),
  };
}

/**
 * Static fallback body for licensed PromptFeed entries. The app hydrates to its
 * interactive prompt detail UI in the browser, while crawlers get real content
 * before client-side JavaScript runs.
 */
export function renderPromptFeedStaticBody(record) {
  const metadata = getPromptFeedSeoMetadata(record);
  if (!metadata) return null;

  const promptTitle = escapeHtml(record.title);
  const targetModel = escapeHtml(record.targetModel);
  const description = escapeHtml(record.description || 'A reusable prompt recipe with a matching example output.');
  const promptText = escapeHtml(record.promptText);
  const category = escapeHtml(record.category || 'Creative prompts');
  const creator = escapeHtml(record.sourceCreator || record.authorOrSource || 'PromptFeed community');
  const previewImage = typeof record.previewImage === 'string'
    && /^\/prompts\/promptfeed\/[a-z0-9-]+\.jpg$/i.test(record.previewImage)
    ? record.previewImage
    : null;
  const previewAlt = escapeHtml(record.previewImageAlt || `${record.title} example output`);
  const attributionUrl = [record.attributionUrl, record.sourceUrl].find(isHttpsPromptFeedUrl);
  const attributionLink = attributionUrl
    ? `<a href="${escapeHtml(attributionUrl)}" rel="nofollow noopener noreferrer">View original prompt source</a>`
    : '';

  return `<main class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
  <nav class="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
    <a href="/" class="hover:underline">SwitchRoute</a>
    <span aria-hidden="true"> / </span>
    <a href="/prompt-library" class="hover:underline">AI Prompt Library</a>
    <span aria-hidden="true"> / </span>
    <span>${promptTitle}</span>
  </nav>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">AI Prompt Recipe · ${category}</p>
    <h1 class="mb-4 text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-4xl">${promptTitle}</h1>
    <p class="mb-6 text-base leading-7 text-slate-600 dark:text-slate-300">${description}</p>
    <p class="mb-6 text-sm text-slate-500 dark:text-slate-400">Target model: <strong class="text-slate-800 dark:text-slate-100">${targetModel}</strong> · Source: ${creator}</p>
    ${previewImage ? `<figure class="mb-8"><img src="${escapeHtml(previewImage)}" alt="${previewAlt}" loading="eager" class="mx-auto max-h-[560px] w-full rounded-xl object-contain" /><figcaption class="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Example output associated with this prompt.</figcaption></figure>` : ''}
    <h2 class="mb-3 text-xl font-semibold text-slate-950 dark:text-white">Prompt template</h2>
    <pre class="mb-6 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"><code>${promptText}</code></pre>
    <div class="border-t border-slate-200 pt-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
      <p class="mb-3">Review the prompt, adapt its details to your project, and explore more recipes in the <a href="/prompt-library" class="font-semibold text-teal-700 underline dark:text-teal-300">SwitchRoute Prompt Library</a>.</p>
      ${attributionLink}
    </div>
  </article>
</main>`;
}
