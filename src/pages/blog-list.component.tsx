import { BookOpen, CalendarDays, Filter, Search } from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { blogService } from '../blog/services/blog.service';
import { Button, Footer, Header, Section, Seo } from '../components';
import { BlogImage } from '../components/Blog';

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const BlogListPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const params = useParams<{ tagSlug?: string; categorySlug?: string }>();
  const [searchParams] = useSearchParams();

  const activeTag = searchParams.get('tag') ?? params.tagSlug ?? '';
  const activeCategory = searchParams.get('category') ?? params.categorySlug ?? '';
  const searchValue = searchParams.get('q') ?? '';
  const sortValue = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const pageValue = Number(searchParams.get('page') ?? '1');
  const page = Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue;

  const listing = React.useMemo(
    () =>
      blogService.getList({
        search: searchValue,
        sort: sortValue,
        tag: activeTag || undefined,
        category: activeCategory || undefined,
        page,
        pageSize: 6,
      }),
    [activeCategory, activeTag, page, searchValue, sortValue]
  );

  const updateQuery = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams);

      for (const [key, value] of Object.entries(updates)) {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }

      if (!('page' in updates)) {
        next.delete('page');
      }

      if (next.get('sort') === 'newest') {
        next.delete('sort');
      }

      if (next.get('page') === '1') {
        next.delete('page');
      }

      const queryString = next.toString();
      navigate(queryString ? `/blog?${queryString}` : '/blog');
    },
    [navigate, searchParams]
  );

  const headingSuffix = activeTag
    ? `Tagged with “${listing.availableTags.find((tag) => tag.slug === activeTag)?.name ?? activeTag}”`
    : activeCategory
      ? `In “${listing.availableCategories.find((category) => category.slug === activeCategory)?.name ?? activeCategory}”`
      : 'Thoughts on architecture, frontend performance, and platform engineering.';

  const seoTitle = activeTag
    ? `${listing.availableTags.find((tag) => tag.slug === activeTag)?.name ?? activeTag} Articles | Jerome Wolff`
    : activeCategory
      ? `${listing.availableCategories.find((category) => category.slug === activeCategory)?.name ?? activeCategory} Articles | Jerome Wolff`
      : 'Blog | Jerome Wolff';
  const seoDescription = activeTag
    ? `Articles tagged ${listing.availableTags.find((tag) => tag.slug === activeTag)?.name ?? activeTag}.`
    : activeCategory
      ? `Articles in the ${listing.availableCategories.find((category) => category.slug === activeCategory)?.name ?? activeCategory} category.`
      : 'Writing on software architecture, frontend performance, cloud platforms, and engineering delivery.';
  const seoPath = params.tagSlug
    ? `/blog/tag/${params.tagSlug}`
    : params.categorySlug
      ? `/blog/category/${params.categorySlug}`
      : '/blog';

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <Header />
      <main id="main">
        <Section
          id="blog"
          titleId="blog-heading"
          title="Blog"
          titleIcon={<BookOpen size={28} aria-hidden />}
          className="blog-list-section"
          titleClassName="blog-list-title"
          contentClassName="blog-list-content"
        >
          <p className="blog-list-intro">{headingSuffix}</p>

          <div className="blog-list-toolbar">
            <label className="blog-search">
              <Search size={16} aria-hidden />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => updateQuery({ q: event.target.value || undefined })}
                placeholder="Search posts"
                aria-label="Search blog posts"
              />
            </label>

            <div className="blog-filters" aria-label="Blog filters">
              <label className="blog-filter">
                <span>
                  <Filter size={14} aria-hidden />
                  Tag
                </span>
                <select
                  value={activeTag}
                  onChange={(event) => updateQuery({ tag: event.target.value || undefined })}
                >
                  <option value="">All tags</option>
                  {listing.availableTags.map((tag) => (
                    <option key={tag.slug} value={tag.slug}>
                      {tag.name} ({tag.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="blog-filter">
                <span>
                  <Filter size={14} aria-hidden />
                  Category
                </span>
                <select
                  value={activeCategory}
                  onChange={(event) => updateQuery({ category: event.target.value || undefined })}
                >
                  <option value="">All categories</option>
                  {listing.availableCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </label>

              <label className="blog-filter">
                <span>
                  <CalendarDays size={14} aria-hidden />
                  Sort
                </span>
                <select
                  value={sortValue}
                  onChange={(event) => updateQuery({ sort: event.target.value })}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>
          </div>

          {listing.posts.length === 0 ? (
            <div className="blog-list-empty">
              <h3>No posts found</h3>
              <p>Try adjusting the search term or active filters.</p>
            </div>
          ) : (
            <>
              <div className="blog-list-grid">
                {listing.posts.map((post) => (
                  <article key={post.metadata.slug} className="blog-card">
                    {post.metadata.featuredImage ? (
                      <Link to={`/blog/${post.metadata.slug}`} className="blog-card-media-link">
                        <BlogImage
                          src={post.metadata.featuredImage}
                          alt={post.metadata.title}
                          className="blog-card-media"
                        />
                      </Link>
                    ) : null}

                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span>{post.metadata.category}</span>
                        <span>{dateFormatter.format(new Date(post.metadata.publishedAt))}</span>
                        <span>{post.metadata.readingTimeText}</span>
                      </div>
                      <h3 className="blog-card-title">
                        <Link to={`/blog/${post.metadata.slug}`}>{post.metadata.title}</Link>
                      </h3>
                      <p className="blog-card-description">{post.metadata.description}</p>
                      <ul className="blog-card-tags" role="list">
                        {post.metadata.tags.map((tag) => (
                          <li key={tag} className="blog-card-tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>

              <div className="blog-list-pagination">
                <Button
                  variant="outline"
                  onClick={() => updateQuery({ page: String(listing.page - 1) })}
                  disabled={listing.page <= 1}
                >
                  Previous
                </Button>
                <span className="blog-list-pagination-label">
                  Page {listing.page} of {listing.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => updateQuery({ page: String(listing.page + 1) })}
                  disabled={listing.page >= listing.totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
});
