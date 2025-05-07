import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryVitePlugin} from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    outDir: 'build',
    sourcemap: true
  },
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "jerome-wolff",
      project: "portfolio"
    })
  ],
});