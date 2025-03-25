<script setup lang="ts">

import Header from './components/Header.vue'
import Main from './components/Main.vue'
import DialogPlan from '@/views/study_plan/components/DialogPlan.vue'
import DialogProcess from '@/views/study_process/components/DialogProcess.vue'
</script>

<template>
  <div class="container">
    <Header class="header"/>
    <el-divider/>
    <Main class="main"/>
  </div>
  <DialogPlan />
  <DialogProcess />
</template>

<style scoped lang="scss">
.container{
  flex-direction: column;
}
</style>
