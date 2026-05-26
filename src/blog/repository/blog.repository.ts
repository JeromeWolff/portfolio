import { parseMarkdownFrontmatter } from '../utils/frontmatter';
import { calculateReadingTime, stripMarkdownForText } from '../utils/reading-time';
import { extractTableOfContents } from '../utils/toc';
import { assertUniquePostSlugs, normalizeBlogFrontmatter } from '../utils/validation';

import type { BlogPost, BlogTaxonomyOption } from '../types';

const rawPostModules = import.meta.glob('/content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function createExcerpt(markdown: string, fallback: string): string {
  const normalized = stripMarkdownForText(markdown);

  if (!normalized) {
    return fallback;
  }

  return normalized.length > 180 ? `${normalized.slice(0, 177).trimEnd()}...` : normalized;
}

function getPostTimestamp(post: BlogPost): number {
  return new Date(post.metadata.updatedAt ?? post.metadata.publishedAt).getTime();
}

function createPost(sourcePath: string, rawMarkdown: string): BlogPost {
  const { data, content } = parseMarkdownFrontmatter(rawMarkdown);
  const normalized = normalizeBlogFrontmatter(data as Record<string, unknown>, sourcePath);
  const readingTime = calculateReadingTime(content);

  return {
    metadata: {
      ...normalized,
      sourcePath,
      readingTimeMinutes: readingTime.minutes,
      readingTimeText: readingTime.text,
    },
    content: content.trim(),
    excerpt: createExcerpt(content, normalized.description),
    headings: extractTableOfContents(content),
  };
}

const parsedPostsCache = Object.entries(rawPostModules)
  .map(([sourcePath, rawMarkdown]) => createPost(sourcePath, rawMarkdown))
  .sort((left, right) => getPostTimestamp(right) - getPostTimestamp(left));

assertUniquePostSlugs(parsedPostsCache.map((post) => post.metadata.slug));

function createTaxonomyOptions(
  values: Array<{ name: string; slug: string }>
): BlogTaxonomyOption[] {
  const counts = new Map<string, BlogTaxonomyOption>();

  for (const value of values) {
    const existing = counts.get(value.slug);
    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(value.slug, { ...value, count: 1 });
  }

  return [...counts.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export const blogRepository = {
  getAllPosts(): BlogPost[] {
    return [...parsedPostsCache];
  },

  getPublishedPosts(): BlogPost[] {
    return parsedPostsCache.filter((post) => !post.metadata.draft);
  },

  getPostBySlug(slug: string): BlogPost | undefined {
    return parsedPostsCache.find((post) => post.metadata.slug === slug);
  },

  getAllTags(): BlogTaxonomyOption[] {
    return createTaxonomyOptions(
      this.getPublishedPosts().flatMap((post) =>
        post.metadata.tags.map((tag, index) => ({ name: tag, slug: post.metadata.tagSlugs[index] }))
      )
    );
  },

  getAllCategories(): BlogTaxonomyOption[] {
    return createTaxonomyOptions(
      this.getPublishedPosts().map((post) => ({
        name: post.metadata.category,
        slug: post.metadata.categorySlug,
      }))
    );
  },
};
