<script setup lang="ts">
function handleSelect(key: string | number, keyPath: Array<string | number>) {
  console.log(key, keyPath)
}
</script>

<template>
  <el-menu class="footer-menu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">版权声明</el-menu-item>
    <el-menu-item index="2">关于我们</el-menu-item>
    <el-menu-item index="3">反馈与建议</el-menu-item>
    <el-menu-item index="4">系统版本</el-menu-item>
    <el-menu-item index="5">帮助</el-menu-item>
  </el-menu>
</template>

<style scoped>
.footer-menu {
  justify-content: center;

  --el-menu-bg-color: #909399;
}
</style>
