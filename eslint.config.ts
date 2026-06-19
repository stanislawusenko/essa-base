import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

/**
 * @file eslint.config.js
 * @description Master linting configuration for ESSA Base.
 * @version 1.0.0
 */

export default tseslint.config(
  /* ==========================================================================
     GLOBAL IGNORES
     ========================================================================== */

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

  /* ==========================================================================
     BASE CONFIGURATIONS
     ========================================================================== */

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  /* ==========================================================================
     CUSTOM RULES & ENVIRONMENT
     ========================================================================== */

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
