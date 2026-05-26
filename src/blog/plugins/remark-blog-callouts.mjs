const calloutTitles = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

function getNodeText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.value ?? '';
  }

  if (!Array.isArray(node.children)) {
    return '';
  }

  return node.children.map((child) => getNodeText(child)).join('');
}

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    visit(child, callback);
  }
}

function findFirstTextNode(node) {
  if (!node) {
    return null;
  }

  if (node.type === 'text') {
    return node;
  }

  if (!Array.isArray(node.children)) {
    return null;
  }

  for (const child of node.children) {
    const match = findFirstTextNode(child);
    if (match) {
      return match;
    }
  }

  return null;
}

export default function remarkBlogCallouts() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'blockquote' || !Array.isArray(node.children)) {
        return;
      }

      const firstParagraphIndex = node.children.findIndex((child) => child.type === 'paragraph');
      if (firstParagraphIndex === -1) {
        return;
      }

      const firstParagraph = node.children[firstParagraphIndex];
      const firstParagraphText = getNodeText(firstParagraph).trim();
      const match = firstParagraphText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
      if (!match) {
        return;
      }

      const variant = match[1].toLowerCase();
      const firstTextNode = findFirstTextNode(firstParagraph);
      if (firstTextNode) {
        firstTextNode.value = firstTextNode.value.replace(/^\[![A-Z]+\]\s*/i, '');
      }

      const bodyChildren = node.children.filter((child, index) => {
        if (index !== firstParagraphIndex) {
          return true;
        }

        return getNodeText(child).trim().length > 0;
      });

      node.data = {
        hName: 'aside',
        hProperties: {
          className: ['blog-callout', `blog-callout-${variant}`],
          role: 'note',
        },
      };
      node.children = [
        {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: { className: ['blog-callout-title'] },
          },
          children: [{ type: 'text', value: calloutTitles[variant] ?? 'Note' }],
        },
        ...bodyChildren,
      ];
    });
  };
}
