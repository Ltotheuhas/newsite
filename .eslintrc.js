// .eslintrc.js
module.exports = {
  env: {
    'vue/setup-compiler-macros': true,   // ← add this line
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: latest,
    sourceType: 'module',
  },
  rules: {
    // your overrides here
  },
}
