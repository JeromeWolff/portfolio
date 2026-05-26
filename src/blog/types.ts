import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;
export type BlogSortOrder = 'newest' | 'oldest';

export interface BlogHeading {
  depth: number;
  value: string;
  slug: string;
}

export interface BlogMetadata {
  title: string;
  slug: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  tagSlugs: string[];
  category: string;
  categorySlug: string;
  featuredImage?: string;
  draft: boolean;
  readingTimeMinutes: number;
  readingTimeText: string;
}

export interface BlogPostRecord {
  metadata: BlogMetadata;
  content: string;
  excerpt: string;
}

export interface BlogPost extends BlogPostRecord {
  entry: BlogEntry;
}

export interface BlogTaxonomyOption {
  name: string;
  slug: string;
  count: number;
}

export interface BlogListFilters {
  search?: string;
  tag?: string;
  category?: string;
  sort?: BlogSortOrder;
  page?: number;
  pageSize?: number;
}

export interface AppliedBlogFilters {
  search: string;
  tag?: string;
  category?: string;
  sort: BlogSortOrder;
}

export interface PaginatedBlogPosts {
  posts: BlogPostRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  availableTags: BlogTaxonomyOption[];
  availableCategories: BlogTaxonomyOption[];
  appliedFilters: AppliedBlogFilters;
}

export interface AdjacentBlogPosts {
  previous: BlogPost | null;
  next: BlogPost | null;
}
