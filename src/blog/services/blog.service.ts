import { blogRepository } from '../repository/blog.repository';

import type {
  AdjacentBlogPosts,
  BlogListFilters,
  BlogPost,
  BlogSortOrder,
  PaginatedBlogPosts,
} from '../types';

function sortPosts(posts: BlogPost[], sortOrder: BlogSortOrder): BlogPost[] {
  const sorted = [...posts].sort((left, right) => {
    const leftValue = new Date(left.metadata.updatedAt ?? left.metadata.publishedAt).getTime();
    const rightValue = new Date(right.metadata.updatedAt ?? right.metadata.publishedAt).getTime();
    return rightValue - leftValue;
  });

  return sortOrder === 'oldest' ? sorted.reverse() : sorted;
}

function matchesSearch(post: BlogPost, search: string): boolean {
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

export const blogService = {
  getList(filters: BlogListFilters = {}): PaginatedBlogPosts {
    const { search = '', tag, category, sort = 'newest', page = 1, pageSize = 6 } = filters;

    const filtered = sortPosts(
      blogRepository
        .getPublishedPosts()
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
      availableTags: blogRepository.getAllTags(),
      availableCategories: blogRepository.getAllCategories(),
      appliedFilters: {
        search,
        tag,
        category,
        sort,
      },
    };
  },

  getPostBySlug(slug: string): BlogPost | undefined {
    const post = blogRepository.getPostBySlug(slug);
    return post && !post.metadata.draft ? post : undefined;
  },

  getAdjacentPosts(slug: string): AdjacentBlogPosts {
    const posts = blogRepository.getPublishedPosts();
    const index = posts.findIndex((post) => post.metadata.slug === slug);

    if (index === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: index > 0 ? posts[index - 1] : null,
      next: index < posts.length - 1 ? posts[index + 1] : null,
    };
  },

  getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
    return blogRepository
      .getPublishedPosts()
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

  getAllPosts(): BlogPost[] {
    return blogRepository.getPublishedPosts();
  },

  getAllTags() {
    return blogRepository.getAllTags();
  },

  getAllCategories() {
    return blogRepository.getAllCategories();
  },
};
