const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const boundaries = require('eslint-plugin-boundaries');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      boundaries,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'boundaries/element-types': [
        2,
        {
          default: 'disallow',
          rules: [
            { from: 'domain', allow: [] },
            { from: 'application', allow: ['domain'] },
            { from: 'infrastructure', allow: ['domain', 'application'] },
            { from: 'presentation', allow: ['application'] },
          ],
        },
      ],
    },
    settings: {
      boundaries: {
        elements: [
          { type: 'domain', pattern: 'src/**/domain/**' },
          { type: 'application', pattern: 'src/**/application/**' },
          { type: 'infrastructure', pattern: 'src/**/infrastructure/**' },
          { type: 'presentation', pattern: 'src/**/presentation/**' },
        ],
      },
    },
  },
];
