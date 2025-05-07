<script setup lang="ts">
import { useTodoStore } from '@/store/todo.ts'
import { dayjs } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { computed } from 'vue'

const todoStore = useTodoStore()
// 获取今日所有待办（包含已完成）
const todayAllTodos = computed(() => {
  const today = dayjs().startOf('day')
  return todoStore.todoList
    .filter((t) => t.deadline && dayjs(t.deadline).isSame(today, 'day'))
    .sort((a, b) => {
      // 先按未完成排序，再按截止时间排序
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1
      }
      return dayjs(a.deadline).unix() - dayjs(b.deadline).unix()
    })
})
// 获取今日完成的待办数量
const todayCompletedTodoCount = computed(() => todayAllTodos.value.length - todoStore.groupTodoList.today.length)
</script>

<template>
  <el-card class="my-card">
    <template #header>
      <div class="card-header">
        <span>今日待办</span>
        <span class="progress">
          {{ todayCompletedTodoCount }} / {{ todayAllTodos.length }}
        </span>
      </div>
    </template>
    <el-collapse :accordion="true" v-for="item in todayAllTodos" :key="item.id">
      <el-collapse-item>
        <template #title>
          <div class="collapse-title">
            <el-checkbox
              :model-value="item.isCompleted"
              @update:modelValue="todoStore.toggleTodoStatus(item.id)"
              @click.stop
            ></el-checkbox>
            <el-tag
              :type="{ high: 'danger', medium: 'warning', low: 'info' }[item.priority] || 'info'"
              class="priority-tag"
            >
              {{ item.priority }}
            </el-tag>
            <span class="title-text">{{ item.title }}</span>
          </div>
        </template>

        <div class="collapse-content">
          <div class="deadline">
            <el-icon><clock /></el-icon>
            截止时间：{{ dayjs(item.deadline).format('HH:mm') }}
          </div>
          <div class="description">
            <el-icon><document /></el-icon>
            描述：{{ item.description || '暂无描述' }}
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<style scoped lang="scss">
.collapse-title {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 0;

  .el-checkbox {
    margin-right: 8px;
  }

  .title-text {
    flex: 1;
    font-size: 15px;
    color: #34495e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .priority-tag {
    min-width: 60px;
    text-align: center;
    text-transform: capitalize;
  }
}

.collapse-content {
  padding: 12px 32px;
  color: #7f8c8d;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  &::before {
    content: '';
    width: 2px;
    height: calc(100% - 24px);
    background: #e8e8e8;
    position: absolute;
    left: 28px;
    top: 12px;
  }

  .deadline,
  .description {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 24px;
  }

  .description {
    white-space: pre-wrap;
    line-height: 1.6;
    padding: 8px 8px 8px -8px;
    background: #f8f9fa;
    border-radius: 4px;

    .el-icon {
      color: #409eff;
    }
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  &-track {
    background: #f1f1f1;
  }
  &-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    &:hover {
      background: #a8a8a8;
    }
  }
}

/* 折叠项动画 */
.el-collapse-item {
  transition: all 0.3s ease;
  margin: 4px 0;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-collapse-item__header) {
    padding: 0 16px;
    background: #fff;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 12px;
  }
}
</style>
