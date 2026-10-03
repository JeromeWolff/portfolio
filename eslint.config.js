import astroPlugin from 'eslint-plugin-astro';

// ESLint only covers Astro templates, which oxlint cannot lint. Everything else is handled by oxlint.
export default [
  {
    ignores: ['.astro/', 'node_modules/', 'dist/', 'build/', '.vercel/'],
  },
  ...astroPlugin.configs.recommended,
  ...astroPlugin.configs['jsx-a11y-recommended'],
];
