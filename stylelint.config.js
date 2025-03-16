export default {
  extends: [
    'stylelint-config-standard', // 基础规则
    'postcss-html', // Vue模板支持
    'stylelint-config-standard-scss', // SCSS标准规则
    'stylelint-config-recess-order', // CSS属性顺序
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  overrides: [
    {
      files: ['**/*.{scss,css,vue,html}'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.{html,vue}'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/public/**'
  ],
  rules: {
    'value-keyword-case': null, // 允许使用v-bind
    'no-descending-specificity': null, // 禁用选择器特异性降序检查
    'function-url-quotes': 'always', // 要求URL函数必须使用引号包裹
    'no-empty-source': null, // 禁用空源码文件检查
    'selector-class-pattern': null, // 禁用类选择器命名模式检查
    'property-no-unknown': null, // 禁用未知属性名检查
    'value-no-vendor-prefix': null, // 禁用值前缀检查（常用于兼容性处理）
    'property-no-vendor-prefix': null, // 禁用属性前缀检查（常用于兼容性处理）
    'selector-pseudo-class-no-unknown': [  // 不允许使用未知的选择器
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'] // 忽略属性
      }
    ]
  }
}
