import type {
  BlogListFilters,
  BlogPostRecord,
  BlogSortOrder,
  BlogTaxonomyOption,
  PaginatedBlogPosts,
} from '../types';

function sortPosts(posts: BlogPostRecord[], sortOrder: BlogSortOrder): BlogPostRecord[] {
  const sorted = [...posts].sort((left, right) => {
    const leftValue = new Date(left.metadata.updatedAt ?? left.metadata.publishedAt).getTime();
    const rightValue = new Date(right.metadata.updatedAt ?? right.metadata.publishedAt).getTime();
    return rightValue - leftValue;
  });

  return sortOrder === 'oldest' ? sorted.reverse() : sorted;
}

function matchesSearch(post: BlogPostRecord, search: string): boolean {
  if (!search) {
    return true;
  }

  const term = search.toLowerCase();
  const haystack = [
    post.metadata.title,
    post.metadata.description,
    post.metadata.author,
    post.metadata.category,
    post.metadata.tags.join(' '),
    post.excerpt,
    post.content,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(term);
}

export function buildTaxonomyOptions(
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

export function getBlogList(
  posts: BlogPostRecord[],
  availableTags: BlogTaxonomyOption[],
  availableCategories: BlogTaxonomyOption[],
  filters: BlogListFilters = {}
): PaginatedBlogPosts {
  const { search = '', tag, category, sort = 'newest', page = 1, pageSize = 6 } = filters;
  const filtered = sortPosts(
    posts
      .filter((post) => !post.metadata.draft)
      .filter((post) => matchesSearch(post, search))
      .filter((post) => (tag ? post.metadata.tagSlugs.includes(tag) : true))
      .filter((post) => (category ? post.metadata.categorySlug === category : true)),
    sort
  );

  const safePageSize = Math.max(1, pageSize);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * safePageSize;

  return {
    posts: filtered.slice(startIndex, startIndex + safePageSize),
    page: currentPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    availableTags,
    availableCategories,
    appliedFilters: {
      search,
      tag,
      category,
      sort,
    },
  };
}
