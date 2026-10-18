import React from 'react';

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

// Parses inline tokens: **bold**, *italic*, `code`, [link](url)
function renderInlineContent(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  // Regex to split by bold, italic, code, or markdown link
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      elements.push(
        <strong key={`b-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      elements.push(
        <em key={`i-${match.index}`} className="italic text-foreground">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      elements.push(
        <code
          key={`c-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary font-medium"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const splitIdx = token.indexOf('](');
      const linkText = token.slice(1, splitIdx);
      const rawHref = token.slice(splitIdx + 2, -1).trim();

      // XSS protocol validation: only allow safe http/https or relative paths
      const isSafe = /^https?:\/\//i.test(rawHref) || rawHref.startsWith('/');
      if (isSafe) {
        elements.push(
          <a
            key={`a-${match.index}`}
            href={rawHref}
            target={rawHref.startsWith('http') ? '_blank' : undefined}
            rel={rawHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      } else {
        elements.push(linkText);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="list-disc list-inside space-y-1.5 my-3 text-secondary-foreground text-sm">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Code block handling (```)
    if (trimmed.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        renderedElements.push(
          <pre
            key={`codeblock-${renderedElements.length}`}
            className="p-3.5 my-4 rounded-lg bg-card/90 border border-border/80 font-mono text-xs overflow-x-auto text-foreground leading-relaxed"
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // 2. Unordered lists (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const itemText = trimmed.slice(2);
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {renderInlineContent(itemText)}
        </li>
      );
      continue;
    } else {
      flushList();
    }

    // 3. Headings
    if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-6 mb-3">
          {renderInlineContent(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-foreground tracking-tight mt-5 mb-2.5">
          {renderInlineContent(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h4 key={`h4-${i}`} className="text-base sm:text-lg font-semibold text-foreground tracking-tight mt-4 mb-2">
          {renderInlineContent(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    // 4. Blockquote / Alert
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.slice(2).replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
      renderedElements.push(
        <blockquote
          key={`quote-${i}`}
          className="p-3 my-3 rounded-lg bg-primary/5 border-l-4 border-primary text-secondary-foreground text-xs sm:text-sm leading-relaxed"
        >
          {renderInlineContent(quoteText)}
        </blockquote>
      );
      continue;
    }

    // 5. Blank line
    if (!trimmed) {
      continue;
    }

    // 6. Regular paragraph
    renderedElements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-secondary-foreground my-2.5">
        {renderInlineContent(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
};
