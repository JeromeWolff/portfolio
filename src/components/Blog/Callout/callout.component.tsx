import { Info, Lightbulb, ShieldAlert, TriangleAlert } from 'lucide-react';
import React from 'react';

type CalloutVariant = 'note' | 'tip' | 'important' | 'warning' | 'caution';

function getTextContent(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getTextContent(child)).join(' ');
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return getTextContent(props.children);
  }

  return '';
}

const variantMap: Record<CalloutVariant, { title: string; Icon: typeof Info }> = {
  note: { title: 'Note', Icon: Info },
  tip: { title: 'Tip', Icon: Lightbulb },
  important: { title: 'Important', Icon: ShieldAlert },
  warning: { title: 'Warning', Icon: TriangleAlert },
  caution: { title: 'Caution', Icon: TriangleAlert },
};

interface CalloutProps {
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = React.memo(({ children }) => {
  const plainText = React.useMemo(
    () => getTextContent(children).replace(/\s+/g, ' ').trim(),
    [children]
  );
  const match = plainText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
  const variant = (match?.[1].toLowerCase() as CalloutVariant | undefined) ?? 'note';
  const { title, Icon } = variantMap[variant];
  const content = plainText.replace(/^\[![A-Z]+\]\s*/i, '').trim();

  return (
    <aside className={`blog-callout blog-callout-${variant}`} role="note">
      <div className="blog-callout-title">
        <Icon size={16} aria-hidden />
        {title}
      </div>
      <p className="blog-callout-body">{content}</p>
    </aside>
  );
});
