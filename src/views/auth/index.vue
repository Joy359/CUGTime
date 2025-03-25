<script setup lang="ts">
import Clock from '@/views/auth/components/Clock.vue'
</script>

<template>
  <div class="body">
    <el-row class="wrapper">
      <el-col :span="12" class="welcome-panel">
        <span>欢迎使用</span>
        <br />
        <span>大学生时间管理系统</span>
        <Clock class="clock" />
      </el-col>
      <el-col :span="12" class="auth-panel">
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
