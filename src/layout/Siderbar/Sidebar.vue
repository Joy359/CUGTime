<!-- src/components/SidebarMenu.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取有效菜单路由
const menuRoutes = computed(() => {
  const allRoutes = router.getRoutes()
  const seenPaths = new Set<string>() // 用于路径去重

  // 获取根路由及其子路由
  const rootRoute = allRoutes.find((r) => r.path === '/')
  const rootChildren = rootRoute?.children || []

  // 获取直接定义的顶级路由
  const topLevelRoutes = allRoutes.filter((route) => {
    const pathSegments = route.path.split('/').filter(Boolean)
    return route.path !== '/' && pathSegments.length === 1
  })

  // 合并并去重
  return (
    [...rootChildren, ...topLevelRoutes]
      .reduce((acc: RouteRecordRaw[], route) => {
        const normalizedPath = route.path.startsWith('/') ? route.path : `/${route.path}`

        if (!seenPaths.has(normalizedPath)) {
          seenPaths.add(normalizedPath)
          acc.push(route)
        }
        return acc
      }, [])
      // 过滤显示条件
      .filter((route) => {
        const hasVisibleSelf = route.meta?.show ?? false
        const hasVisibleChildren = route.children?.some((child) => child.meta?.show) ?? false
        return hasVisibleSelf || hasVisibleChildren
      })
  )
})

// 检查是否有需要显示的子路由
const hasVisibleChildren = (route: RouteRecordRaw) =>
  route.children?.some((child) => child.meta?.show)

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 处理菜单点击
const handleSelect = (path: string) => {
  router.push(path)
}
</script>
<template>
  <el-menu :default-active="activeMenu" mode="vertical" @select="handleSelect" class="sidebar-menu">
    <h2 class="sidebar-title">大学生时间管理系统</h2>
    <template v-for="route in menuRoutes" :key="route.path">
      <!-- 有子路由的菜单项 -->
      <el-sub-menu v-if="hasVisibleChildren(route)" :index="route.path">
        <template #title>
          <span>{{ route.meta?.title }}</span>
        </template>
        <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">
          <span>{{ child.meta?.title }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 没有子路由的菜单项 -->
      <el-menu-item v-else :index="route.path">
        <span>{{ route.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
.sidebar-menu {
  --el-menu-bg-color: #40485b;

  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-title {
  padding: 10px 0 20px;
  font-size: 20px;
  font-weight: bold;
  color: #fff; /* 标题颜色 */
  text-align: center;
  border-bottom: 1px solid #545c64; /* 底部边框 */
}
</style>
