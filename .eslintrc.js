/*
 * @Author: robinY yangshirobin@163.com
 * @Date: 2025-07-25 09:12:07
 * @LastEditors: robinY yangshirobin@163.com
 * @LastEditTime: 2025-07-25 09:12:12
 * @FilePath: /web-fmy/.eslintrc.js
 * @Description:
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential', // 使用 Vue 3 的基本规则集
    'standard', // 例如，你也可以使用 'standard' 或其他 ESLint 分享配置
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@babel/eslint-parser', // 如果你使用 Babel，可以指定 parser
  },
  rules: {
    // 在这里添加或覆盖规则
  },
}
