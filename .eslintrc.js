module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    // browser: true,
    node: true,
    serviceworker: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js'],
      },
    },
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    indent: 'off',
    'jsx-a11y/anchor-is-valid': ['error', {
      aspects: ['invalidHref', 'preferButton'],
    }],
    'no-console': ['error', {
      allow: ['error', 'info', 'log'],
    }],
    'react/no-danger': 0,
    'import/extensions': ['error', 'never'],
    'max-len': ['error', { ignoreComments: true, code: 150 }],
    semi: ['error', 'never'],
    '@typescript-eslint/no-var-requires': 0,
    'no-useless-constructor': 0,
    'class-methods-use-this': 0,
  },
}
