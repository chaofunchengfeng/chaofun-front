module.exports = {
  root: true,
  env: {
    node: true
  },
  // extends: ["plugin:vue/essential", "@vue/prettier"],
  extends: ['plugin:vue/essential'],
  rules: {
    'curly': 2,
    'brace-style': [2, '1tbs'],
    'quotes': [2, 'single'],
    'semi': [2, 'always'],
    'space-infix-ops': 2,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
