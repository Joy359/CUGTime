import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus' // 导入ElementPlus组件库所有的模块和功能
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // ElementPlus中文语言包
import App from './App.vue'
import router from './router'
// 引入全局样式
import './assets/styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册 Element Plus 组件库的区域语言为中文简体
app.use(ElementPlus, {
  locale: zhCn,
})
// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
