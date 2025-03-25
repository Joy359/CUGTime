<script setup lang="ts">

import DialogProcess from './components/DialogProcess.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'
</script>

<template>
  <div class="container">
    <Header />
    <el-divider />
    <Main />
  </div>
  <DialogProcess />
</template>

<style scoped lang="scss">
.container{
  flex-direction: column;
  align-items: center;
}
</style>
