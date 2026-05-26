import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import { importX } from 'eslint-plugin-import-x';
import jsoncPlugin from 'eslint-plugin-jsonc';
import globals from 'globals';
import * as jsoncParser from 'jsonc-eslint-parser';

// Helper function to safely filter globals
const filterGlobals = (globalsObj) => {
  if (!globalsObj || typeof globalsObj !== 'object') {
    return {};
  }
  try {
    return Object.fromEntries(Object.entries(globalsObj).filter(([key]) => key && !/\s/.test(key)));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {};
  }
};

// Get filtered globals
const browserGlobals = filterGlobals(globals.browser);
const nodeGlobals = filterGlobals(globals.node);
const es2021Globals = filterGlobals(globals.es2021);

export default [
  // Global ignores
  {
    ignores: [
      '.astro/',
      'node_modules/',
      'dist/',
      'build/',
      '.vercel/',
      '.netlify/',
      'playwright-report/',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'test-results/',
    ],
  },
  ...astroPlugin.configs.recommended,
  ...astroPlugin.configs['jsx-a11y-recommended'],
  // Base JavaScript and TypeScript configuration
  {
    files: ['**/*.{cjs,js,mjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...es2021Globals,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'import-x': importX,
    },
    rules: {
      // Base rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Handled by @typescript-eslint
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-param-reassign': 'error',
      'prefer-arrow-callback': 'error',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Import rules
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/first': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-unresolved': 'off', // Handled by TypeScript
      'import-x/no-default-export': 'off',
    },
  },
  // JSON configuration
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
    plugins: {
      jsonc: jsoncPlugin,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
];
