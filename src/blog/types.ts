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
  sourcePath: string;
}

export interface BlogPost {
  metadata: BlogMetadata;
  content: string;
  excerpt: string;
  headings: BlogHeading[];
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

export interface PaginatedBlogPosts {
  posts: BlogPost[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  availableTags: BlogTaxonomyOption[];
  availableCategories: BlogTaxonomyOption[];
  appliedFilters: {
    search: string;
    tag?: string;
    category?: string;
    sort: BlogSortOrder;
  };
}

export interface AdjacentBlogPosts {
  previous: BlogPost | null;
  next: BlogPost | null;
}
