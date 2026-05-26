import React from 'react';

import type { BlogHeading } from '../../../blog/types';

interface TOCProps {
  headings: BlogHeading[];
}

export const TOC: React.FC<TOCProps> = React.memo(({ headings }) => {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-title">On this page</p>
      <ol className="blog-toc-list">
        {headings.map((heading) => (
          <li key={heading.slug} className={`blog-toc-item blog-toc-item-depth-${heading.depth}`}>
            <a href={`#${heading.slug}`} className="blog-toc-link">
              {heading.value}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
});
