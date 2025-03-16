<script setup lang="ts">
import Clock from '@/views/login/compoents/Clock.vue'
import LoginForm from './compoents/LoginForm.vue'
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
        <LoginForm />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
@use './index';
</style>
