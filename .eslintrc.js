module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'simple-import-sort',
    'unicorn',
    'sort-keys',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // Using TypeScript for prop validation

    // Import sorting
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // Next.js rules (disabled - plugin not available without eslint-config-next)
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',

    // Unicorn rules
    'unicorn/consistent-destructuring': 'off',
    'unicorn/prefer-top-level-await': 'off',
  },
  ignorePatterns: [
    '.next/',
    'node_modules/',
    'dist/',
    '.turbo/',
    '*.config.js',
    '*.config.ts',
    'bin/',
    'src/shopify/storefront/index.ts',
    'src/shopify/admin/index.ts',
  ],
};
