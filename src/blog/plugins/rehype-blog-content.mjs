function visit(node, callback, parent = null) {
  callback(node, parent);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of [...node.children]) {
    visit(child, callback, node);
  }
}

function wrapNode(parent, node, wrapper) {
  if (!parent || !Array.isArray(parent.children)) {
    return;
  }

  const index = parent.children.indexOf(node);
  if (index === -1) {
    return;
  }

  wrapper.children = [node];
  parent.children[index] = wrapper;
}

function isExternalLink(href) {
  return typeof href === 'string' && /^https?:\/\//.test(href);
}

export default function rehypeBlogContent() {
  return (tree) => {
    visit(tree, (node, parent) => {
      if (node.type !== 'element') {
        return;
      }

      if (node.tagName === 'a' && isExternalLink(node.properties?.href)) {
        node.properties = {
          ...node.properties,
          target: '_blank',
          rel: 'noreferrer',
        };
      }

      if (node.tagName === 'img' && parent?.type === 'element' && parent.tagName !== 'figure') {
        const title =
          typeof node.properties?.title === 'string' ? node.properties.title : undefined;
        if (title) {
          delete node.properties.title;
        }

        wrapNode(parent, node, {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['blog-image'] },
          children: title
            ? [
                node,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: { className: ['blog-image-caption'] },
                  children: [{ type: 'text', value: title }],
                },
              ]
            : [node],
        });
      }

      if (node.tagName === 'table' && parent?.tagName !== 'div') {
        wrapNode(parent, node, {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['blog-table'],
            role: 'region',
            'aria-label': 'Scrollable table',
          },
          children: [node],
        });
      }
    });
  };
}
