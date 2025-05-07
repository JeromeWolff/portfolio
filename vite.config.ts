import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryVitePlugin} from "@sentry/vite-plugin";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      outDir: 'build',
      sourcemap: true
    },
    define: {
      'process.env.SENTRY_DSN': JSON.stringify(env.SENTRY_DSN),
      'process.env.SENTRY_AUTH_TOKEN': JSON.stringify(env.SENTRY_AUTH_TOKEN),
    },
    plugins: [
      react(),
      tsconfigPaths(),
      sentryVitePlugin({
        org: "jerome-wolff",
        project: "portfolio"
      })
    ]
  };
});