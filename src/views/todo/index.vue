<script setup lang="ts">
import Header from '@/views/todo/components/Header.vue'
import Main from '@/views/todo/components/Main.vue'
import { onMounted } from 'vue'
import { useTodoStore } from '@/store/todo'
import DialogTodo from '@/views/todo/components/DialogTodo.vue'

const todoStore = useTodoStore()
onMounted(async () => {
  await todoStore.loadTodoList()
})
</script>

<template>
  <el-container class="container">
    <el-header class="header">
      <Header />
    </el-header>
    <el-main>
      <Main />
    </el-main>
  </el-container>
  <DialogTodo />
</template>

<style scoped lang="scss">
$gradient-bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
.container {
  flex-direction: column;
  justify-content: space-between;
}
.header {
  background: $gradient-bg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  width: 1000px;
  margin: 0 auto 12px;
}
</style>
