// eslint.config.js — ESLint 9 flat config
// npm i -D eslint@9 @eslint/js@9 globals eslint-plugin-react eslint-plugin-react-hooks \
//          eslint-plugin-boundaries eslint-import-resolver-typescript
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';

const SHARED = ['components', 'hooks', 'context', 'services', 'lib', 'utils', 'data', 'assets'];

export default [
  { ignores: ['dist', 'build', 'coverage', '.next', 'node_modules'] },

  js.configs.recommended,

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, boundaries },
    settings: {
      react: { version: 'detect' },
      // resolve the "@/..." alias from jsconfig.json / tsconfig.json
      'import/resolver': {
        typescript: { project: ['./tsconfig.json', './jsconfig.json'], alwaysTryTypes: true },
      },
      // layers from references/code-structure.md
      'boundaries/elements': [
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'layouts', pattern: 'src/layouts/**' },
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        { type: 'components', pattern: 'src/components/**' },
        { type: 'hooks', pattern: 'src/hooks/**' },
        { type: 'context', pattern: 'src/context/**' },
        { type: 'services', pattern: 'src/services/**' },
        { type: 'lib', pattern: 'src/lib/**' },
        { type: 'utils', pattern: 'src/utils/**' },
        { type: 'data', pattern: 'src/data/**' },
        { type: 'assets', pattern: 'src/assets/**' },
        { type: 'app', pattern: 'src/*.{js,jsx,ts,tsx}', partialMatch: false },
      ],
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/no-danger': 'error', // X3: dangerouslySetInnerHTML
      'react/jsx-no-target-blank': 'error', // X5: target=_blank without rel
      'react/jsx-no-script-url': 'error', // X4: javascript: URLs
      'react/no-unstable-nested-components': 'error', // R2
      'react/no-array-index-key': 'warn', // R14
      'no-eval': 'error', // X7
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // S1, S2, S3: import direction + feature entry point (boundaries v7 syntax)
      // policies are evaluated in order; the last matching policy wins
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        policies: [
          // third-party and Node core modules (S5 is enforced by no-restricted-imports below)
          { allow: { to: { module: { origin: ['external', 'core'] } } } },
          { from: { element: { type: 'app' } }, allow: { to: { element: { types: '*' } } } },
          { from: { element: { type: 'pages' } }, allow: { to: { element: { types: { anyOf: ['layouts', 'feature', ...SHARED] } } } } },
          { from: { element: { type: 'layouts' } }, allow: { to: { element: { types: { anyOf: ['feature', ...SHARED] } } } } },
          { from: { element: { type: 'feature' } }, allow: { to: { element: { types: { anyOf: ['feature', ...SHARED] } } } } },
          { from: { element: { types: { anyOf: ['components', 'hooks', 'context', 'services'] } } }, allow: { to: { element: { types: { anyOf: SHARED } } } } },
          { from: { element: { type: 'lib' } }, allow: { to: { element: { types: { anyOf: ['lib', 'utils', 'data'] } } } } },
          { from: { element: { type: 'utils' } }, allow: { to: { element: { types: { anyOf: ['utils', 'data'] } } } } },
          { from: { element: { type: 'data' } }, allow: { to: { element: { type: 'data' } } } },
          // S1: from outside a feature, only its index file may be imported
          { disallow: { to: { element: { type: 'feature', fileInternalPath: '!index.{js,jsx,ts,tsx}' } } } },
          // files inside the same feature may import each other freely
          { allow: { dependency: { relationship: { to: 'internal' } } } },
        ],
      }],

      // S5: third-party HTTP/date/storage libraries only inside src/lib
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'axios', message: 'S5: import through @/lib instead.' },
          { name: 'ky', message: 'S5: import through @/lib instead.' },
          { name: 'dayjs', message: 'S5: import through @/lib instead.' },
          { name: 'date-fns', message: 'S5: import through @/lib instead.' },
        ],
      }],
    },
  },

  // the facade layer is the one place allowed to import those libraries
  { files: ['src/lib/**'], rules: { 'no-restricted-imports': 'off' } },

  // tests may reach into feature internals
  {
    files: ['**/__tests__/**', '**/*.test.{js,jsx,ts,tsx}'],
    languageOptions: { globals: { ...globals.vitest, ...globals.jest } },
    rules: { 'boundaries/dependencies': 'off' },
  },
];
