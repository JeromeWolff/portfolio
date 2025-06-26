import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsoncPlugin from 'eslint-plugin-jsonc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';

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

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.vercel/', '.netlify/', 'package-lock.json'],
  },
  // Base JavaScript and TypeScript configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
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
      'import/order': [
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
      'import/first': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-unresolved': 'off', // Handled by TypeScript
      'import/no-default-export': 'off',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Not needed with TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
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
