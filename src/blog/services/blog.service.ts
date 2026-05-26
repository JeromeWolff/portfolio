import { getCollection } from 'astro:content';

import { buildTaxonomyOptions, getBlogList } from '../utils/listing';
import { calculateReadingTime, stripMarkdownForText } from '../utils/reading-time';
import { assertUniquePostSlugs, slugifySegment } from '../utils/validation';

import type {
  AdjacentBlogPosts,
  BlogEntry,
  BlogListFilters,
  BlogPost,
  BlogTaxonomyOption,
} from '../types';

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

function normalizePost(entry: BlogEntry): BlogPost {
  const body = entry.body ?? '';
  const readingTime = calculateReadingTime(body);

  return {
    entry,
    metadata: {
      title: entry.data.title,
      slug: slugifySegment(entry.data.slug),
      description: entry.data.description,
      author: entry.data.author,
      publishedAt: entry.data.publishedAt.toISOString(),
      updatedAt: entry.data.updatedAt?.toISOString(),
      tags: entry.data.tags,
      tagSlugs: entry.data.tags.map((tag) => slugifySegment(tag)),
      category: entry.data.category,
      categorySlug: slugifySegment(entry.data.category),
      featuredImage: entry.data.featuredImage,
      draft: entry.data.draft,
      readingTimeMinutes: readingTime.minutes,
      readingTimeText: readingTime.text,
    },
    content: body.trim(),
    excerpt: createExcerpt(body, entry.data.description),
  };
}

let cachedPostsPromise: Promise<BlogPost[]> | undefined;

async function loadAllPosts(): Promise<BlogPost[]> {
  if (!cachedPostsPromise) {
    cachedPostsPromise = getCollection('blog')
      .then((entries) => entries.map((entry) => normalizePost(entry)))
      .then((posts) => {
        assertUniquePostSlugs(posts.map((post) => post.metadata.slug));
        return posts.sort((left, right) => getPostTimestamp(right) - getPostTimestamp(left));
      });
  }

  return cachedPostsPromise;
}

async function loadPublishedPosts(): Promise<BlogPost[]> {
  const posts = await loadAllPosts();
  return posts.filter((post) => !post.metadata.draft);
}

function getTags(posts: BlogPost[]): BlogTaxonomyOption[] {
  return buildTaxonomyOptions(
    posts.flatMap((post) =>
      post.metadata.tags.map((tag, index) => ({ name: tag, slug: post.metadata.tagSlugs[index] }))
    )
  );
}

function getCategories(posts: BlogPost[]): BlogTaxonomyOption[] {
  return buildTaxonomyOptions(
    posts.map((post) => ({
      name: post.metadata.category,
      slug: post.metadata.categorySlug,
    }))
  );
}

export const blogService = {
  async getList(filters: BlogListFilters = {}) {
    const posts = await loadPublishedPosts();
    return getBlogList(posts, getTags(posts), getCategories(posts), filters);
  },

  async getAllPosts(): Promise<BlogPost[]> {
    return loadPublishedPosts();
  },

  async getAllPostsIncludingDrafts(): Promise<BlogPost[]> {
    return loadAllPosts();
  },

  async getPostBySlug(
    slug: string,
    options: { includeDrafts?: boolean } = {}
  ): Promise<BlogPost | undefined> {
    const posts = options.includeDrafts ? await loadAllPosts() : await loadPublishedPosts();
    return posts.find((post) => post.metadata.slug === slug);
  },

  async getAdjacentPosts(slug: string): Promise<AdjacentBlogPosts> {
    const posts = await loadPublishedPosts();
    const index = posts.findIndex((post) => post.metadata.slug === slug);

    if (index === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: index > 0 ? posts[index - 1] : null,
      next: index < posts.length - 1 ? posts[index + 1] : null,
    };
  },

  async getRelatedPosts(currentPost: BlogPost, limit = 3): Promise<BlogPost[]> {
    const posts = await loadPublishedPosts();

    return posts
      .filter((post) => post.metadata.slug !== currentPost.metadata.slug)
      .map((post) => {
        const sharedTags = post.metadata.tagSlugs.filter((slug) =>
          currentPost.metadata.tagSlugs.includes(slug)
        ).length;
        const sharedCategory =
          post.metadata.categorySlug === currentPost.metadata.categorySlug ? 2 : 0;

        return {
          post,
          score: sharedTags + sharedCategory,
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map((entry) => entry.post);
  },

  async getAllTags(): Promise<BlogTaxonomyOption[]> {
    return getTags(await loadPublishedPosts());
  },

  async getAllCategories(): Promise<BlogTaxonomyOption[]> {
    return getCategories(await loadPublishedPosts());
  },
};
