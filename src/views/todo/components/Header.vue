<script setup lang="ts">
import { Calendar, Plus } from '@element-plus/icons-vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { dayjs } from 'element-plus'
import { useTodoStore } from '@/store/todo.ts'
import { useDialogStore } from '@/store/dialog.ts'
// 动态时间处理
const currentTime = ref('')
let timer: number

const updateTime = () => {
  currentTime.value = dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const todoStore = useTodoStore()
const dialogStore = useDialogStore()

const handleAddTodo = () => {
  todoStore.resetTodoForm()
  dialogStore.open('todo_add','新建待办')
}
</script>

<template>
  <div class="header-content">
    <div class="title-wrapper">
      <el-icon :size="28" color="#409EFF"><Calendar /></el-icon>
      <h1 class="title">待办事项管理</h1>
    </div>
    <div class="time-display">
      {{ currentTime }}
    </div>
    <el-button @click="handleAddTodo" class="add-todo-btn" type="primary" :icon="Plus">
      新建待办任务
    </el-button>
  </div>
  <el-divider class="custom-divider" />
</template>

<style scoped lang="scss">
$primary-color: #409eff;
$text-primary: #303133;
$text-secondary: #606266;

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 0 auto;

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;

    .title {
      font-size: 1.8rem;
      color: $text-primary;
      margin: 0;
      font-weight: 600;
      letter-spacing: 1px;
      background: linear-gradient(45deg, $primary-color, #67c23a);
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .time-display {
    font-size: 1.1rem;
    color: $text-secondary;
    font-family: monospace;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.custom-divider {
  margin: 1rem 0 0;
  --el-border-color: rgba(64, 158, 255, 0.2);
}

.add-todo-btn {
  $primary-color: #409eff;
  $hover-color: #3375b9;
  height: 48px;
  border-radius: 8px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 图标样式
  :deep(.el-icon) {
    margin-right: 8px;
    font-size: 18px;
    transition: transform 0.2s;
  }

  // 主样式
  background: $primary-color;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);

  // 悬停效果
  &:hover {
    background: $hover-color;
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
    transform: translateY(-2px);
    :deep(.el-icon) {
      transform: scale(1.1);
    }
  }
}
</style>
