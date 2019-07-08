// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  plugins: [], extends: [
    'plugin:vue/base',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 0,
    'no-debugger': 0,
    'space-before-function-paren': 0,
    'indent': 0,
    'no-unused-vars': 0,
    'no-useless-escape': 0,
    'no-empty': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
