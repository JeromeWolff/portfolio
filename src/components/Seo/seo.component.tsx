import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_SITE_URL = 'https://www.jeromewolff.de';
const DEFAULT_IMAGE = '/android-chrome-512x512.png';

type SeoType = 'website' | 'article';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: SeoType;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function buildAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl, siteUrl).toString();
  } catch {
    return `${siteUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
  }
}

export const Seo: React.FC<SeoProps> = React.memo(
  ({
    title,
    description,
    path = '/',
    image = DEFAULT_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Jerome Wolff',
    tags = [],
    noindex = false,
    structuredData,
  }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL;
    const canonicalUrl = buildAbsoluteUrl(siteUrl, path);
    const imageUrl = buildAbsoluteUrl(siteUrl, image);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';
    const jsonLd = structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : [];

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content={type} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />

        {author ? <meta name="author" content={author} /> : null}
        {tags.length > 0 ? <meta name="keywords" content={tags.join(', ')} /> : null}
        {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
        {modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}
        {tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {jsonLd.map((entry, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(entry)}
          </script>
        ))}
      </Helmet>
    );
  }
);
