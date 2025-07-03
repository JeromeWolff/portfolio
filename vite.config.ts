import * as fs from 'fs';
import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function getPathsFromTsConfig() {
  const tsconfigRaw = fs.readFileSync('./tsconfig.json', 'utf-8').replace(/\/\/.*$/gm, ''); // Removing comments
  const tsconfig = JSON.parse(tsconfigRaw);
  const aliases = {};
  for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
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
      sourcemap: true,
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
