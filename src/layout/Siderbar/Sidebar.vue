<!-- src/components/SidebarMenu.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'

// 获取 Vue Router 实例
const router = useRouter()
const route = useRoute()

/**
 * **计算有效的菜单路由**
 * 1. 获取所有定义的路由 `router.getRoutes()`
 * 2. 获取 `/` 根路由的子路由
 * 3. 获取所有的顶级路由（没有父级的）
 * 4. **去重**（避免重复添加相同路径）
 * 5. 过滤出需要在菜单中显示的路由（`meta.show: true`）
 */
const menuRoutes = computed(() => {
  const allRoutes = router.getRoutes() // 获取所有路由
  const seenPaths = new Set<string>() // 用于去重路径

  // 找到 `/` 根路由的子路由
  const rootRoute = allRoutes.find((r) => r.path === '/')
  const rootChildren = rootRoute?.children || []

  // 获取顶级路由（直接定义的，没有父路由的）
  const topLevelRoutes = allRoutes.filter((route) => {
    const pathSegments = route.path.split('/').filter(Boolean) // 分割路径
    return route.path !== '/' && pathSegments.length === 1 // 仅保留一级路由
  })

  return (
      [...rootChildren, ...topLevelRoutes]
          .reduce((acc: RouteRecordRaw[], route) => {
            // 规范化路径，确保路径是以 `/` 开头的
            const normalizedPath = route.path.startsWith('/') ? route.path : `/${route.path}`

            // 避免重复路径
            if (!seenPaths.has(normalizedPath)) {
              seenPaths.add(normalizedPath)
              acc.push(route)
            }
            return acc
          }, [])
          // 过滤掉 `meta.show: false` 的路由，仅保留需要显示的菜单
          .filter((route) => {
            const hasVisibleSelf = route.meta?.show ?? false // 是否自身可见
            const hasVisibleChildren = route.children?.some((child) => child.meta?.show) ?? false // 子路由是否可见
            return hasVisibleSelf || hasVisibleChildren
          })
  )
})

/**
 * **检查是否有需要显示的子路由**
 * @param {RouteRecordRaw} route - 当前菜单路由
 * @returns {boolean} 是否包含 `meta.show: true` 的子菜单
 */
const hasVisibleChildren = (route: RouteRecordRaw) =>
    route.children?.some((child) => child.meta?.show)

/**
 * **计算当前激活的菜单项**
 * 通过 `route.path` 获取当前选中的菜单项，使菜单项保持高亮状态
 */
const activeMenu = computed(() => route.path)

/**
 * **处理菜单点击**
 * 通过 `router.push(path)` 进行页面跳转
 * @param {string} path - 需要跳转的路由路径
 */
const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<template>
  <!-- 侧边栏菜单 -->
  <el-menu
      :default-active="activeMenu"
      mode="vertical"
      @select="handleSelect"
      class="sidebar-menu"
  >
    <!-- 侧边栏标题 -->
    <h2 class="sidebar-title">大学生时间管理系统</h2>

    <!-- 遍历计算出的 `menuRoutes`，生成菜单项 -->
    <template v-for="route in menuRoutes" :key="route.path">
      <!-- 如果该路由有可见的子路由，则渲染 `el-sub-menu` -->
      <el-sub-menu v-if="hasVisibleChildren(route)" :index="route.path">
        <template #title>
          <span>{{ route.meta?.title }}</span>
        </template>
        <!-- 遍历子路由，生成二级菜单项 -->
        <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="child.path"
        >
          <span>{{ child.meta?.title }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 没有子路由的情况下，直接渲染 `el-menu-item` -->
      <el-menu-item v-else :index="route.path">
        <span>{{ route.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
/* 侧边栏菜单样式 */
.sidebar-menu {
  --el-menu-bg-color: #40485b; /* 菜单背景色 */
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 250px; /* 设定侧边栏宽度 */
  height: 100vh; /* 让菜单撑满整个屏幕高度 */
  padding-top: 20px;
}

/* 侧边栏标题 */
.sidebar-title {
  padding: 10px 0 20px;
  font-size: 20px;
  font-weight: bold;
  color: #fff; /* 标题字体颜色 */
  text-align: center;
  border-bottom: 1px solid #545c64; /* 底部分割线 */
}

/* 一级菜单项（顶级菜单） */
.el-menu-item {
  color: #ffffff; /* 菜单项字体颜色 */
  font-size: 16px;
  padding-left: 20px;
  transition: all 0.3s ease-in-out;
}

/* 鼠标悬停时的效果 */
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #0ef; /* 高亮颜色 */
}

/* 选中菜单项的高亮效果 */
.el-menu-item.is-active {
  background-color: rgba(14, 255, 239, 0.3);
  font-weight: bold;
  color: #0ef;
}

/* 二级菜单项 */
.el-sub-menu {
  font-size: 14px;
}

/* 二级菜单项的文本颜色 */
.el-sub-menu .el-menu-item {
  color: #ccc;
}

/* 二级菜单项鼠标悬停时 */
.el-sub-menu .el-menu-item:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

/* 二级菜单项选中时 */
.el-sub-menu .el-menu-item.is-active {
  background-color: rgba(14, 255, 239, 0.2);
  color: #0ef;
}
</style>
