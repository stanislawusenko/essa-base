import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

/**
 * ESLint Flat Configuration
 */
export default tseslint.config(
  // 1. Global Ignores (у tseslint.config це працює автоматично)
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.vite/**',
      'public/**',
      'src/partials/**',
      'bun.lock',
      'bun.lockb',
      'package-lock.json',
    ],
  },

  // 2. Base Configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // 3. Custom Rules
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
        Alpine: 'readonly',
      },
    },
    rules: {
      // Enforce consistent style
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],

      // Unused vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Allow console
      'no-console': 'off',
    },
  }
)
