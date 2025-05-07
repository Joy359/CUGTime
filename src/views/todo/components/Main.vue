<!--待办主体区域-->
<script setup lang="ts">
import { Bell, Calendar, CircleCheck, Refresh, Warning } from '@element-plus/icons-vue'
import { useTodoStore } from '@/store/todo.ts'
import { storeToRefs } from 'pinia'
import type { CategoryMap, TodoItem } from '@/types/todo'
import CategoryHeader from '@/views/todo/components/CategoryHeader.vue'
import TaskItem from '@/views/todo/components/TaskItem.vue'
import { isRecentUpdate } from '@/utils/timeHelper.ts'
const todoStore = useTodoStore()
const { groupTodoList } = storeToRefs(todoStore)
const categoryMap: CategoryMap = {
  today: { label: '今日任务', icon: Calendar },
  tomorrow: { label: '明日任务', icon: Bell },
  future: { label: '未来任务', icon: Refresh },
  expired: { label: '已过期', icon: Warning },
  noDate: { label: '无日期', icon: CircleCheck },
  completed: { label: '已完成', icon: CircleCheck },
}

// 判断是否有最近更新
const hasRecentUpdate = (items: TodoItem[]) =>
  items.some((item) => isRecentUpdate(new Date(item.updatedAt)))
</script>

<template>
  <el-collapse :accordion="true">
    <el-collapse-item v-for="(value, key) in groupTodoList" :key="key" v-show="value.length > 0">
      <template #title>
        <CategoryHeader
          :categoryKey="key"
          :categoryValue="value"
          :categoryMap="categoryMap"
          :hasRecentUpdate="hasRecentUpdate(value)"
        />
      </template>
      <div v-for="item in value" :key="item.id" class="todo-item">
        <TaskItem :item="item" :categoryKey="key" :categoryValue="value" />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
$primary: #409eff;
$success: #67c23a;
$warning: #e6a23c;
$danger: #f56c6c;
$text-primary: #303133;
$text-regular: #606266;
$border-color: #ebeef5;

:deep(.el-collapse-item) {
  max-width: 1000px;
  margin: 0 auto 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
}
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin: 10px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  &:hover :deep(.action-buttons) {
    opacity: 1;
  }
}
</style>
