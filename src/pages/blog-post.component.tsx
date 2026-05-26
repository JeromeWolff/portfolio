import 'highlight.js/styles/github-dark.css';

import { ArrowLeft, ArrowRight, BookOpenText, CalendarDays, Clock3, Tag } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { blogService } from '../blog/services/blog.service';
import { Footer, Header, Seo } from '../components';
import { BlogImage, BlogTable, Callout, CodeBlock, ReadingProgress, TOC } from '../components/Blog';

import type { Components } from 'react-markdown';

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const markdownComponents: Components = {
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  img: ({ src, alt, title }) => (
    <BlogImage
      src={typeof src === 'string' ? src : ''}
      alt={alt ?? ''}
      caption={title ?? undefined}
    />
  ),
  table: ({ children }) => <BlogTable>{children}</BlogTable>,
  blockquote: ({ children }) => <Callout>{children}</Callout>,
  a: ({ href, children }) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },
};

export const BlogPostPage: React.FC = React.memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const post = React.useMemo(() => (slug ? blogService.getPostBySlug(slug) : undefined), [slug]);
  const adjacent = React.useMemo(() => (slug ? blogService.getAdjacentPosts(slug) : null), [slug]);
  const related = React.useMemo(() => (post ? blogService.getRelatedPosts(post) : []), [post]);

  if (!post || !slug) {
    return (
      <>
        <Seo
          title="Article not found | Jerome Wolff"
          description="The requested article could not be found."
          path="/blog"
          noindex
        />
        <Header />
        <main id="main" className="blog-post-page">
          <section className="blog-post-not-found">
            <div className="blog-post-hero-inner">
              <h1 className="blog-post-title">Article not found</h1>
              <p className="blog-post-description">
                The requested article does not exist or is no longer public.
              </p>
              <Link to="/blog" className="btn btn-primary btn-lg">
                View all posts
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const seoPath = `/blog/${post.metadata.slug}`;
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description: post.metadata.description,
    author: {
      '@type': 'Person',
      name: post.metadata.author,
    },
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.updatedAt ?? post.metadata.publishedAt,
    image: post.metadata.featuredImage
      ? [`https://www.jeromewolff.de${post.metadata.featuredImage}`]
      : undefined,
    keywords: post.metadata.tags,
    articleSection: post.metadata.category,
    mainEntityOfPage: `https://www.jeromewolff.de${seoPath}`,
  };

  return (
    <>
      <Seo
        title={`${post.metadata.title} | Jerome Wolff`}
        description={post.metadata.description}
        path={seoPath}
        image={post.metadata.featuredImage}
        type="article"
        publishedTime={post.metadata.publishedAt}
        modifiedTime={post.metadata.updatedAt ?? post.metadata.publishedAt}
        author={post.metadata.author}
        tags={post.metadata.tags}
        structuredData={blogPostingSchema}
      />
      <Header />
      <ReadingProgress />
      <main id="main" className="blog-post-page">
        <section className="blog-post-hero">
          <div className="blog-post-hero-inner">
            <Link to="/blog" className="blog-post-backlink">
              <ArrowLeft size={16} aria-hidden />
              Back to blog
            </Link>
            <div className="blog-post-taxonomy">
              <span className="blog-post-category">{post.metadata.category}</span>
              {post.metadata.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">
                  <Tag size={12} aria-hidden />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="blog-post-title">{post.metadata.title}</h1>
            <p className="blog-post-description">{post.metadata.description}</p>
            <div className="blog-post-meta">
              <span>
                <CalendarDays size={16} aria-hidden />
                {dateFormatter.format(new Date(post.metadata.publishedAt))}
              </span>
              <span>
                <Clock3 size={16} aria-hidden />
                {post.metadata.readingTimeText}
              </span>
            </div>
            {post.metadata.featuredImage ? (
              <BlogImage
                src={post.metadata.featuredImage}
                alt={post.metadata.title}
                className="blog-post-featured-image"
                loading="eager"
              />
            ) : null}
          </div>
        </section>

        <section className="blog-post-layout">
          <article className="blog-post-article">
            <div className="blog-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    { behavior: 'append', properties: { className: ['blog-heading-anchor'] } },
                  ],
                  rehypeHighlight,
                ]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          <aside className="blog-post-sidebar">
            <TOC headings={post.headings} />
          </aside>
        </section>

        <section className="blog-post-footer-sections">
          <div className="blog-post-navigation">
            {adjacent?.previous ? (
              <Link to={`/blog/${adjacent.previous.metadata.slug}`} className="blog-post-nav-link">
                <ArrowLeft size={16} aria-hidden />
                <span>
                  <strong>Previous article</strong>
                  <span>{adjacent.previous.metadata.title}</span>
                </span>
              </Link>
            ) : (
              <div />
            )}
            {adjacent?.next ? (
              <Link
                to={`/blog/${adjacent.next.metadata.slug}`}
                className="blog-post-nav-link blog-post-nav-link-next"
              >
                <span>
                  <strong>Next article</strong>
                  <span>{adjacent.next.metadata.title}</span>
                </span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {related.length > 0 ? (
            <section className="blog-post-related" aria-labelledby="related-posts-heading">
              <div className="blog-post-hero-inner">
                <h2 id="related-posts-heading" className="blog-post-related-title">
                  <BookOpenText size={24} aria-hidden />
                  Related articles
                </h2>
                <div className="blog-post-related-grid">
                  {related.map((relatedPost) => (
                    <article key={relatedPost.metadata.slug} className="blog-post-related-card">
                      <h3>
                        <Link to={`/blog/${relatedPost.metadata.slug}`}>
                          {relatedPost.metadata.title}
                        </Link>
                      </h3>
                      <p>{relatedPost.metadata.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
});
