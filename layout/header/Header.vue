<script setup lang="ts">
function handleSelect(key: string | number, keyPath: Array<string | number>) {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu class="header-menu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">消息中心</el-menu-item>
    <el-menu-item index="2">个人中心</el-menu-item>
    <el-menu-item index="3">设置</el-menu-item>
  </el-menu>
</template>

<style scoped>
.header-menu {
  justify-content: flex-end;

  --el-menu-bg-color: #606266;
}
</style>
