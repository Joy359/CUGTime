<!--待办项下拉组件-->
<script setup lang="ts">
import { Calendar, Delete, Edit, Clock } from '@element-plus/icons-vue'
import type { TodoCategory, TodoItem } from '@/types/todo'
import { useTodoStore } from '@/store/todo.ts'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { isRecentUpdate, myFormatDate } from '@/utils/time-utils.ts'
import { useDialogStore } from '@/store/dialog.ts'
defineProps<{
  item: TodoItem
  categoryKey: TodoCategory
  categoryValue: TodoItem[]
}>()
const todoStore = useTodoStore()
const dialogStore = useDialogStore()
const { currentTodo, currentTodoCache } = storeToRefs(todoStore)

const { toggleTodoStatus } = todoStore
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定永久删除该任务？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    distinguishCancelAndClose: true,
  }).then(() => {
    useTodoStore().deleteTodo(id)
    ElMessage.success('删除成功')
  })
}
const handleEdit = (todoItem: TodoItem) => {
  dialogStore.open('todo_edit','编辑待办')
  Object.assign(currentTodo.value, todoItem)
  // 数据缓存
  currentTodoCache.value = cloneDeep(currentTodo.value)
}
const handleChecked = (id: number) => {
  toggleTodoStatus(id)
}

</script>

<template>
  <div class="item-content" :class="categoryKey">
    <!-- 复选框 -->
    <el-checkbox
      @click="handleChecked(item.id)"
      :checked="categoryKey === 'completed'"
    ></el-checkbox>
    <!-- 优先级显示 -->
    <el-tag
      :type="item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'"
    >
      {{ item.priority }}
    </el-tag>
    <!-- 日历小图标  -->
    <el-icon :size="12"><Calendar /></el-icon>
    <!-- 截止日期 -->
    <el-tag v-if="item.deadline" class="deadline">{{ myFormatDate(item.deadline) }}</el-tag>
    <!-- 任务标题 -->
    <span class="todo-title">{{ item.title }}</span>
  </div>
  <!-- 更新时间显示 -->
  <div class="item-update">
    <div class="update-time">
      <el-icon :size="12"><Clock /></el-icon>
      <span>上次更新: {{ myFormatDate(item.updatedAt!) }}</span>
    </div>
    <el-tag
      v-if="isRecentUpdate(item.updatedAt)"
      type="warning"
      size="small"
      class="header-update-tag"
    >
      最近更新
    </el-tag>
  </div>

  <div class="action-buttons">
    <el-button type="primary" :icon="Edit" circle @click="handleEdit(item)" />
    <el-button type="danger" :icon="Delete" circle @click="handleDelete(item.id)" />
  </div>
</template>

<style scoped lang="scss">
$primary: #409eff;
$success: #67c23a;
$warning: #e6a23c;
$danger: #f56c6c;
$text-primary: #303133;
$text-regular: #606266;
$border-color: #ebeef5;
.item-content {
  width: 50%;
  display: flex;
  align-items: center;
  gap: 12px;
  .deadline {
    color: $text-regular;
  }
  .todo-title {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }
}
.action-buttons {
  opacity: 0;
  transition: opacity 0.2s;
}
.completed {
  text-decoration: line-through;
  color: #909399;
  :deep(.el-tag__content) {
    color: #909399;
  }
  .todo-title {
    color: #909399;
  }
}

.expired {
  color: $danger;
  :deep(.el-tag__content) {
    color: $danger;
  }
  .todo-title {
    color: $danger;
  }
}

.item-update {
  display: flex;
  align-items: center;
  gap: 8px;
  .update-time {
    margin-top: 4px;
    font-size: 0.8em;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .header-update-tag {
    transform: scale(0.9);
  }
}
</style>
