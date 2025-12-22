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
    'plugin:react-hooks/recommended',
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
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'simple-import-sort',
    'unicorn',
    'sonarjs',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript - Enhanced rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    // Note: These rules require type checking (parserOptions.project)
    // Uncomment if you want stricter type checking (may slow down linting)
    // '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    // '@typescript-eslint/no-unnecessary-condition': 'warn',
    // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    // '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    'no-unused-vars': 'off',
    'no-shadow': 'off', // Using TypeScript version

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/no-array-index-key': 'warn',
    'react/no-unescaped-entities': 'error',
    'react/self-closing-comp': ['error', { component: true, html: true }],

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Import sorting
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports
          ['^\\u0000'],
          // React and Next.js
          ['^react', '^next'],
          // Internal packages
          ['^@/'],
          // Parent imports
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // Accessibility - Enhanced rules
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',

    // Code Quality (SonarJS)
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/prefer-immediate-return': 'warn',
    'sonarjs/prefer-single-boolean-return': 'warn',

    // General JavaScript/TypeScript - Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-destructuring': ['warn', { object: true, array: false }],
    'no-else-return': 'warn',
    'no-lonely-if': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-useless-return': 'error',
    'no-useless-concat': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-object-spread': 'error',
    'no-throw-literal': 'error',
    'no-return-await': 'error',
    'require-await': 'off', // Disabled - async functions may be used for type compatibility or future await
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'no-promise-executor-return': 'error',
    'no-return-assign': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'warn',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'array-callback-return': ['error', { allowImplicit: true }],
    'default-case': 'warn',
    'default-case-last': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-param-reassign': ['warn', { props: true }],
    'no-sequences': 'error',
    'no-undef-init': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-void': 'error',
    radix: 'error',
    yoda: 'error',

    // Unicorn rules
    'unicorn/consistent-destructuring': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prefer-module': 'off', // Next.js uses CommonJS in config files
    'unicorn/no-array-callback-reference': 'warn',
    'unicorn/no-array-for-each': 'off', // forEach is sometimes needed
    'unicorn/prefer-array-find': 'warn',
    'unicorn/prefer-array-some': 'warn',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/no-useless-undefined': 'warn',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-regexp-test': 'error',

    // Next.js rules (manually added since we're not using eslint-config-next)
    '@next/next/no-html-link-for-pages': 'off', // Can't use without eslint-config-next
    '@next/next/no-img-element': 'off', // Can't use without eslint-config-next
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
