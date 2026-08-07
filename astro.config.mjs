import { createRequire } from 'module';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig, envField } from 'astro/config';
import expressiveCode from 'astro-expressive-code';

const require = createRequire(import.meta.url);

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
  vite: {
    resolve: {
      alias: {
        tailwindcss: require.resolve('tailwindcss/index.css'),
      },
      tsconfigPaths: true,
    },
    build: {
      manifest: true,
      emptyOutDir: true,
      sourcemap: 'hidden',
      minify: 'oxc',
    },
    plugins: [],
  },
});
