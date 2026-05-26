import GithubSlugger from 'github-slugger';

import type { BlogHeading } from '../types';

const HEADING_PATTERN = /^(#{2,6})\s+(.+)$/gm;

function cleanHeadingText(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+#*$/g, '')
    .trim();
}

export function extractTableOfContents(markdown: string): BlogHeading[] {
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];

  for (const match of markdown.matchAll(HEADING_PATTERN)) {
    const depth = match[1].length;
    const value = cleanHeadingText(match[2]);

    if (!value) {
      continue;
    }

    headings.push({
      depth,
      value,
      slug: slugger.slug(value),
    });
  }

  return headings;
}
