import { Check, Copy } from 'lucide-react';
import React from 'react';

function extractTextContent(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child)).join('');
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractTextContent(props.children);
  }

  return '';
}

function extractLanguage(node: React.ReactNode): string | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const language = extractLanguage(child);
      if (language) {
        return language;
      }
    }
    return null;
  }

  if (React.isValidElement(node)) {
    const props = node.props as { className?: string; children?: React.ReactNode };
    const className = props.className ?? '';
    const match = className.match(/language-([\w-]+)/);
    if (match) {
      return match[1];
    }
    return extractLanguage(props.children);
  }

  return null;
}

interface CodeBlockProps {
  children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = React.memo(({ children }) => {
  const [copied, setCopied] = React.useState(false);
  const code = React.useMemo(() => extractTextContent(children).replace(/\n$/, ''), [children]);
  const language = React.useMemo(() => extractLanguage(children), [children]);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <div className="blog-codeblock">
      <div className="blog-codeblock-toolbar">
        <span className="blog-codeblock-language">{language ?? 'code'}</span>
        <button type="button" className="blog-codeblock-copy" onClick={handleCopy}>
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="blog-codeblock-pre">{children}</pre>
    </div>
  );
});
