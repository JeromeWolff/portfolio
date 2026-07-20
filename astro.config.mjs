import { createRequire } from 'module';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig, envField } from 'astro/config';
import expressiveCode from 'astro-expressive-code';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const src = (p) => resolve(__dirname, 'src', p);
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
        '@': src(''),
        '@components': src('components'),
        '@config': src('config'),
        '@layouts': src('layouts'),
        '@styles': src('styles'),
        // Vite's built-in CSS @import resolver fails on tailwindcss's
        // "style" export condition (vite@8 + tailwindcss@4.3.2), so point
        // the bare specifier at the concrete file directly.
        tailwindcss: require.resolve('tailwindcss/index.css'),
      },
    },
    build: {
      sourcemap: 'hidden',
    },
    plugins: [],
  },
});
