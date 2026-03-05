import * as fs from 'fs';
import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function getPathsFromTsConfig(): Record<string, string> {
  const tsconfigRaw = fs.readFileSync('./tsconfig.json', 'utf-8').replace(/\/\/.*$/gm, ''); // Removing comments
  const tsconfig = JSON.parse(tsconfigRaw) as {
    compilerOptions: { paths?: Record<string, string[]> };
  };
  const aliases: Record<string, string> = {};
  const paths = tsconfig.compilerOptions.paths ?? {};
  for (const [key, value] of Object.entries(paths)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      // Handle both wildcard and base alias
      if (key.endsWith('/*') && value[0].endsWith('/*')) {
        aliases[key.replace('/*', '')] = path.resolve(__dirname, value[0].replace('/*', ''));
        aliases[key] = path.resolve(__dirname, value[0]);
      } else {
        aliases[key] = path.resolve(__dirname, value[0]);
      }
    }
  }
  return aliases;
}

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
      alias: getPathsFromTsConfig(),
    },
    plugins: [
      react(),
      tsconfigPaths(),
      sentryVitePlugin({
        org: 'jerome-wolff',
        project: 'portfolio',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
  };
});
