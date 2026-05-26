import { getBlogList } from '@blog/utils/listing';

import type {
  BlogListFilters,
  BlogPostRecord,
  BlogSortOrder,
  BlogTaxonomyOption,
  PaginatedBlogPosts,
} from '@blog/types';

interface BlogFiltersState {
  posts: BlogPostRecord[];
  availableTags: BlogTaxonomyOption[];
  availableCategories: BlogTaxonomyOption[];
  initialFilters: BlogListFilters;
}

interface LocationLike {
  pathname: string;
  search: string;
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function parsePageValue(value: string | null): number {
  const page = Number(value ?? '1');
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

function readFilters(initialFilters: BlogListFilters, locationLike: LocationLike): BlogListFilters {
  const searchParams = new URLSearchParams(locationLike.search);
  const isTaxonomyPath = locationLike.pathname !== '/blog';

  return {
    search: searchParams.get('q') ?? '',
    sort: searchParams.get('sort') === 'oldest' ? 'oldest' : (initialFilters.sort ?? 'newest'),
    tag: searchParams.get('tag') ?? (isTaxonomyPath ? initialFilters.tag : undefined),
    category:
      searchParams.get('category') ?? (isTaxonomyPath ? initialFilters.category : undefined),
    page: parsePageValue(searchParams.get('page')),
    pageSize: initialFilters.pageSize ?? 6,
  };
}

function buildBlogUrl(filters: BlogListFilters): string {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set('q', filters.search);
  }

  if (filters.tag) {
    searchParams.set('tag', filters.tag);
  }

  if (filters.category) {
    searchParams.set('category', filters.category);
  }

  if (filters.sort === 'oldest') {
    searchParams.set('sort', filters.sort);
  }

  if (filters.page && filters.page > 1) {
    searchParams.set('page', String(filters.page));
  }

  const queryString = searchParams.toString();
  return queryString ? `/blog?${queryString}` : '/blog';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPostCard(post: BlogPostRecord): string {
  const postUrl = `/blog/${encodeURIComponent(post.metadata.slug)}`;
  const featuredImage = post.metadata.featuredImage
    ? `
      <a href="${postUrl}" class="blog-card-media-link">
        <figure class="blog-image blog-card-media">
          <img
            src="${escapeHtml(post.metadata.featuredImage)}"
            alt="${escapeHtml(post.metadata.title)}"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </a>
    `
    : '';

  const tags = post.metadata.tags
    .map(
      (tag) => `
        <li class="blog-card-tag">${escapeHtml(tag)}</li>
      `
    )
    .join('');

  return `
    <article class="blog-card">
      ${featuredImage}
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span>${escapeHtml(post.metadata.category)}</span>
          <span>${escapeHtml(dateFormatter.format(new Date(post.metadata.publishedAt)))}</span>
          <span>${escapeHtml(post.metadata.readingTimeText)}</span>
        </div>
        <h2 class="blog-card-title">
          <a href="${postUrl}">${escapeHtml(post.metadata.title)}</a>
        </h2>
        <p class="blog-card-description">${escapeHtml(post.metadata.description)}</p>
        <ul class="blog-card-tags">
          ${tags}
        </ul>
      </div>
    </article>
  `;
}

function renderResults(listing: PaginatedBlogPosts): string {
  if (listing.posts.length === 0) {
    return `
      <div class="blog-list-empty">
        <h3>No posts found</h3>
        <p>Try adjusting the search term or active filters.</p>
      </div>
    `;
  }

  const postsMarkup = listing.posts.map((post) => renderPostCard(post)).join('');
  return `<div class="blog-list-grid">${postsMarkup}</div>`;
}

function renderPagination(listing: PaginatedBlogPosts): string {
  if (listing.posts.length === 0) {
    return '';
  }

  const previousPage = Math.max(1, listing.page - 1);
  const nextPage = Math.min(listing.totalPages, listing.page + 1);
  const previousDisabled = listing.page <= 1 ? ' disabled' : '';
  const nextDisabled = listing.page >= listing.totalPages ? ' disabled' : '';

  return `
    <div class="blog-list-pagination">
      <button
        type="button"
        class="btn btn-outline"
        data-page-target="${previousPage}"${previousDisabled}
      >
        Previous
      </button>
      <span class="blog-list-pagination-label">
        Page ${listing.page} of ${listing.totalPages}
      </span>
      <button
        type="button"
        class="btn btn-outline"
        data-page-target="${nextPage}"${nextDisabled}
      >
        Next
      </button>
    </div>
  `;
}

function readState(root: HTMLElement): BlogFiltersState | null {
  const stateElement = root.querySelector<HTMLScriptElement>('[data-blog-state]');
  const stateText = stateElement?.textContent;

  if (!stateText) {
    return null;
  }

  return JSON.parse(stateText) as BlogFiltersState;
}

export function initializeBlogFilters(root: HTMLElement): void {
  if (root.dataset.enhanced === 'true') {
    return;
  }

  const state = readState(root);
  const resultsContainer = root.querySelector<HTMLElement>('[data-blog-results]');
  const paginationContainer = root.querySelector<HTMLElement>('[data-blog-pagination]');
  const searchInput = root.querySelector<HTMLInputElement>('[data-blog-search]');
  const tagSelect = root.querySelector<HTMLSelectElement>('[data-blog-tag]');
  const categorySelect = root.querySelector<HTMLSelectElement>('[data-blog-category]');
  const sortSelect = root.querySelector<HTMLSelectElement>('[data-blog-sort]');

  if (
    !state ||
    !resultsContainer ||
    !paginationContainer ||
    !searchInput ||
    !tagSelect ||
    !categorySelect ||
    !sortSelect
  ) {
    return;
  }

  root.dataset.enhanced = 'true';

  let filters = readFilters(state.initialFilters, window.location);

  const renderListing = (): void => {
    const listing = getBlogList(state.posts, state.availableTags, state.availableCategories, {
      ...filters,
      sort: (filters.sort as BlogSortOrder | undefined) ?? 'newest',
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 6,
    });

    searchInput.value = listing.appliedFilters.search;
    tagSelect.value = listing.appliedFilters.tag ?? '';
    categorySelect.value = listing.appliedFilters.category ?? '';
    sortSelect.value = listing.appliedFilters.sort;
    resultsContainer.innerHTML = renderResults(listing);
    paginationContainer.innerHTML = renderPagination(listing);
  };

  const updateFilters = (updates: Partial<BlogListFilters>): void => {
    filters = {
      ...filters,
      ...updates,
    };

    if (!('page' in updates)) {
      filters.page = 1;
    }

    window.history.pushState({}, '', buildBlogUrl(filters));
    renderListing();
  };

  searchInput.addEventListener('input', () => {
    updateFilters({ search: searchInput.value || undefined });
  });

  tagSelect.addEventListener('change', () => {
    updateFilters({ tag: tagSelect.value || undefined });
  });

  categorySelect.addEventListener('change', () => {
    updateFilters({ category: categorySelect.value || undefined });
  });

  sortSelect.addEventListener('change', () => {
    updateFilters({ sort: sortSelect.value as BlogSortOrder });
  });

  root.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>('[data-page-target]');

    if (!button || button.disabled) {
      return;
    }

    const page = Number(button.dataset.pageTarget ?? '1');

    if (Number.isNaN(page)) {
      return;
    }

    updateFilters({ page });
  });

  window.addEventListener('popstate', () => {
    filters = readFilters(state.initialFilters, window.location);
    renderListing();
  });

  renderListing();
}
