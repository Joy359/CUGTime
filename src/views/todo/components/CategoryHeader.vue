<!--待办项标题组件-->
<script setup lang="ts">
import type { CategoryMap, TodoCategory } from '@/types/todo'
import type { TodoItem } from '@/types/todo'
defineProps<{
  hasRecentUpdate: boolean
  categoryMap: CategoryMap
  categoryKey: TodoCategory
  categoryValue: TodoItem[]
}>()
</script>

<template>
  <div class="category-header">
    <el-icon :size="18" class="header-icon">
      <component :is="categoryMap[categoryKey].icon" />
    </el-icon>
    <span class="header-content">
      {{ categoryMap[categoryKey].label }}
    </span>
    <el-tag size="small" effect="light">{{ categoryValue.length }}</el-tag>
    <el-tag type="warning" class="header-update-tag" v-if="hasRecentUpdate">最近更新</el-tag>
  </div>
</template>

<style scoped lang="scss">
.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px;
  .header-icon {
    color: #409eff;
  }
  .header-content {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    letter-spacing: 1px;
  }
  .header-update-tag {
    margin-left: 20px;
    transform: scale(0.8);
    vertical-align: middle;
  }
}
</style>
