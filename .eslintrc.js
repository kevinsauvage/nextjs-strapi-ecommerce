module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules/', '.next/', '.turbo/', 'dist/', 'postcss.config.mjs'],
  globals: {
    React: 'writable',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@/components', './src/components'],
          ['@/contexts', './src/contexts'],
          ['@/config', './src/config'],
          ['@/hooks', './src/hooks'],
          ['@/assets', './src/assets'],
          ['@/data', './src/data'],
          ['@/styles', './src/styles'],
          ['@/lib', './src/lib'],
          ['@/helpers', './src/helpers'],
          ['@/utils', './src/utils'],
          ['@/layout', './src/layout'],
          ['@/modals', './src/modals'],
          ['@/shopify', './src/shopify'],
          ['@/types', './src/types'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: [
    'typescript',
    'react',
    'simple-import-sort',
    'css-modules',
    'sonarjs',
    'sort-keys',
    'unicorn',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsx-a11y/recommended',
    'plugin:css-modules/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'next',
    'next/core-web-vitals',
  ],
  rules: {
    // TS / General
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'error',
    'no-console': 'off',
    'no-param-reassign': 'error',
    'prefer-const': 'error',
    'default-param-last': 0,
    'no-multi-spaces': 'error',
    'no-underscore-dangle': 0,
    'consistent-return': 0,

    // Imports & sorting
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react', '^@?\\w'], // Packages
          ['^(@|components)(/.*|$)'], // Internal
          ['^\\u0000'], // Side effects
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Relative imports
          ['^.+\\.?(css)$'], // Style imports
        ],
      },
    ],

    // React
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/prop-types': 'off',
    'react/no-unused-prop-types': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: ['CustomInputLabel'],
        labelAttributes: ['label'],
        controlComponents: ['CustomInput'],
        depth: 3,
      },
    ],

    // Unicorn
    'unicorn/no-array-reduce': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/filename-case': 0,
    'unicorn/no-new-array': 0,
    'unicorn/no-null': 0,

    // Sort Keys
    'sort-keys': 0,
    'sort-keys/sort-keys-fix': 1,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },

      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
};
