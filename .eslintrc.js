module.exports = {
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
