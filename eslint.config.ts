import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/public/**'],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  // ==================== TypeScript 配置 ====================
  {
    // 指定 TypeScript 文件路径
    files: ['**/*.{ts,tsx,mts,vue}'],
    languageOptions: {
      // 使用 TypeScript 解析器
      parser: tsParser,
      parserOptions: {
        // 指定 tsconfig.json 文件位置
        project: './tsconfig.json',
        projectService: true, // 启用 projectService
        tsconfigRootDir: import.meta.dirname,
        // 支持解析 .vue 文件
        extraFileExtensions: ['.vue']
      },
    },
    rules: {
      // 禁止定义未使用的变量
      '@typescript-eslint/no-unused-vars': 'error',
      // 允许使用 any 类型
      '@typescript-eslint/no-explicit-any': 'error',
      // 允许使用非空断言操作符 (!)
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 允许使用自定义 TypeScript 模块和命名空间
      '@typescript-eslint/no-namespace': 'off',
      // 禁止使用分号
      'semi': 'off',
      // 禁止使用 ts-ignore，必须使用 ts-expect-error 并提供描述
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description' }
      ]
    }
  },
  // ==================== Vue 配置 ====================
  {
    // 指定 Vue 文件路径
    files: ['**/*.vue'],
    languageOptions: {
      // 使用 Vue 解析器
      parser: vueParser,
      parserOptions: {
        // 使用 TypeScript 解析器解析 Vue 文件中的脚本部分
        parser: tsParser,
        sourceType: 'module'
      }
    },
    rules: {
      // 允许单个单词的组件名称
      'vue/multi-word-component-names': 'off',
      // 允许修改组件的 props
      'vue/no-mutating-props': 'off',
      // 允许在模板中使用驼峰命名法的属性
      'vue/attribute-hyphenation': 'off',
      // 强制组件标签顺序为 script -> template -> style
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style']
      }],
      // 允许使用 v-html 指令，但会发出警告
      'vue/no-v-html': 'warn',
    }
  },
  {
    rules: {
      // 要求使用 let 或 const 而不是 var
      'no-var': 'error',
      // 不允许多个空行，最多允许一个空行
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      // 禁止空余的多行
      'no-unexpected-multiline': 'error',
      // 禁止不必要的转义字符
      'no-useless-escape': 'off',
      // 要求使用 const 而不是 let 声明未重新赋值的变量
      'prefer-const': 'error',
      // 箭头函数体应该使用大括号，除非函数体只有一条语句
      'arrow-body-style': ['warn', 'as-needed']
    },
  },
])
