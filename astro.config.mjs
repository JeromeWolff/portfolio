import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig, envField } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import tsconfigPaths from 'vite-tsconfig-paths';

import rehypeBlogContent from './src/blog/plugins/rehype-blog-content.mjs';
import remarkBlogCallouts from './src/blog/plugins/remark-blog-callouts.mjs';

const site = process.env.PUBLIC_SITE_URL ?? 'https://www.jeromewolff.de';

export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        access: 'public',
        context: 'client',
        optional: true,
      }),
    },
  },
  integrations: [
    sitemap(),
    expressiveCode({
      themes: ['github-dark'],
      frames: {
        showCopyToClipboardButton: true,
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm, remarkBlogCallouts],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: 'append', properties: { className: ['blog-heading-anchor'] } },
        ],
        rehypeBlogContent,
      ],
    }),
  },
  vite: {
    build: {
      sourcemap: 'hidden',
    },
    plugins: [tsconfigPaths()],
  },
});
