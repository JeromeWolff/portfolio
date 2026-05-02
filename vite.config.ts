import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React core in one chunk for better caching
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react';
            }
            // Sentry and analytics in vendor chunk to keep main app small
            if (id.includes('node_modules/@sentry/') || id.includes('node_modules/@vercel/')) {
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 400,
    },
    define: {
      'process.env.SENTRY_DSN': JSON.stringify(env.SENTRY_DSN),
      'process.env.SENTRY_AUTH_TOKEN': JSON.stringify(env.SENTRY_AUTH_TOKEN),
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      react(),
      sentryVitePlugin({
        org: 'jerome-wolff',
        project: 'portfolio',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
  };
});
