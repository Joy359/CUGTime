<!--该页面为顶部导航栏和侧边菜单栏-->
<script setup lang="ts">
import Sidebar from './Siderbar/Sidebar.vue'
import Header from './header/Header.vue'
import Footer from './footer/Footer.vue'
import { onMounted } from 'vue'
import { useProcessStore } from '@/store/process.ts'
import { usePlanStore } from '@/store/plan.ts'
import { useTodoStore } from '@/store/todo.ts'

const processStore = useProcessStore()
const todoStore = useTodoStore()
const planStore = usePlanStore()
// 组件挂载时自动加载数据
onMounted(() => {
  planStore.loadPlanMap()
  processStore.loadProcessMap()
  todoStore.loadTodoList()
})
</script>

<template>
  <el-container class="body">
    <el-aside class="sidebar">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
      <el-footer class="footer">
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.body {
  overflow: hidden;
}
.sidebar {
  width: 200px;
  padding: 10px;
  background-color: #40485b;
  box-shadow: 2px 0 5px rgb(0 0 0 / 10%); /* 添加阴影 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  background-color: #606266; /* 深灰色背景 */
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%); /* 添加阴影 */
}

.main {
  width: 100%;
  padding: 20px;
  overflow-y: auto; /* 垂直滚动条 */
  color: #333; /* 深色文字 */
  background-color: #f0f2f5; /* 浅灰色背景 */
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #909399; /* 灰色背景 */
  box-shadow: 0 -2px 5px rgb(0 0 0 / 10%); /* 添加阴影 */
}

/* 统一匹配aside-menu，header-menu，footer-menu，设置共同样式 */
.body [class$='-menu'] {
  width: 100%;
  height: 100%;

  --el-menu-text-color: #fff;
  --el-menu-active-color: #ffd04d;

  border: none; /* 清除element边框默认样式 */
}
</style>
