import { describe, expect, it } from 'vitest';

import { getBlogList } from '../../src/blog/utils/listing';

import type { BlogPostRecord } from '../../src/blog/types';

const posts: BlogPostRecord[] = [
  {
    metadata: {
      title: 'React Performance',
      slug: 'react-performance',
      description: 'Practical performance wins.',
      author: 'Jerome',
      publishedAt: '2026-02-14T00:00:00.000Z',
      updatedAt: '2026-02-17T00:00:00.000Z',
      tags: ['react', 'performance'],
      tagSlugs: ['react', 'performance'],
      category: 'Frontend Engineering',
      categorySlug: 'frontend-engineering',
      featuredImage: '/images/blog/react-performance-cover.svg',
      draft: false,
      readingTimeMinutes: 3,
      readingTimeText: '3 min read',
    },
    content: 'Measure first, then optimize.',
    excerpt: 'Measure first, then optimize.',
  },
  {
    metadata: {
      title: 'Platform Engineering',
      slug: 'platform-engineering-kubernetes',
      description: 'Treat your platform as a product.',
      author: 'Jerome',
      publishedAt: '2026-03-03T00:00:00.000Z',
      updatedAt: '2026-03-08T00:00:00.000Z',
      tags: ['platform-engineering', 'kubernetes'],
      tagSlugs: ['platform-engineering', 'kubernetes'],
      category: 'Cloud Architecture',
      categorySlug: 'cloud-architecture',
      featuredImage: '/images/blog/platform-engineering-cover.svg',
      draft: false,
      readingTimeMinutes: 4,
      readingTimeText: '4 min read',
    },
    content: 'Default paths should be faster than custom ones.',
    excerpt: 'Default paths should be faster than custom ones.',
  },
  {
    metadata: {
      title: 'Draft Post',
      slug: 'draft-post',
      description: 'Should never appear.',
      author: 'Jerome',
      publishedAt: '2026-01-01T00:00:00.000Z',
      tags: ['draft'],
      tagSlugs: ['draft'],
      category: 'Hidden',
      categorySlug: 'hidden',
      draft: true,
      readingTimeMinutes: 1,
      readingTimeText: '1 min read',
    },
    content: 'Draft content',
    excerpt: 'Draft content',
  },
];

const availableTags = [
  { name: 'React', slug: 'react', count: 1 },
  { name: 'Performance', slug: 'performance', count: 1 },
  { name: 'Platform Engineering', slug: 'platform-engineering', count: 1 },
  { name: 'Kubernetes', slug: 'kubernetes', count: 1 },
];

const availableCategories = [
  { name: 'Cloud Architecture', slug: 'cloud-architecture', count: 1 },
  { name: 'Frontend Engineering', slug: 'frontend-engineering', count: 1 },
];

describe('getBlogList', () => {
  it('filters drafts and sorts newest first by default', () => {
    const result = getBlogList(posts, availableTags, availableCategories);

    expect(result.posts).toHaveLength(2);
    expect(result.posts[0]?.metadata.slug).toBe('platform-engineering-kubernetes');
    expect(result.posts[1]?.metadata.slug).toBe('react-performance');
  });

  it('filters by tag and category while preserving pagination metadata', () => {
    const result = getBlogList(posts, availableTags, availableCategories, {
      tag: 'react',
      category: 'frontend-engineering',
      page: 1,
      pageSize: 10,
    });

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0]?.metadata.slug).toBe('react-performance');
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('matches search terms across content and paginates', () => {
    const result = getBlogList(posts, availableTags, availableCategories, {
      search: 'default paths',
      page: 2,
      pageSize: 1,
      sort: 'oldest',
    });

    expect(result.posts).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.posts[0]?.metadata.slug).toBe('platform-engineering-kubernetes');
  });
});
