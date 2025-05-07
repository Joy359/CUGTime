<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue'
import { usePlanStore } from '@/store/plan.ts'
import { myFormatDate } from '@/utils/timeHelper.ts'
import { useDialogStore } from '@/store/dialog.ts'
import { useProcessStore } from '@/store/process.ts'

const planStore = usePlanStore()
const dialogStore = useDialogStore()
const processStore = useProcessStore()

const tableData = computed(() => Array.from(planStore.planMap.values()))
const handleViewProgress = (planId: number) => {
  planStore.currentPlanId = planId
  dialogStore.open('processView','', '学习过程')
}
const handleAddProgress = (planId: number) => {
  planStore.currentPlanId = planId
  dialogStore.open('process','add', '记录学习过程')
}
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定永久删除该任务？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    distinguishCancelAndClose: true,
  }).then(() => {
    planStore.deletePlan(id)
    ElMessage.success('删除成功')
  })
}
const handleEdit = (planId: number) => {
  planStore.currentPlanId = planId
  dialogStore.open('plan','edit', '编辑计划')
}
</script>

<template>
  <el-table
    :data="tableData"
    stripe
    border
    header-cell-class-name="table-header"
    row-class-name="table-row"
    :default-sort="{ prop: 'createdAt', order: 'descending' }"
  >
    <el-table-column prop="title" label="计划标题" width="180" align="center"/>
    <el-table-column prop="startTime" label="开始时间" width="120" align="center" sortable>
      <template #default="scope">
        {{ myFormatDate(scope.row.startTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="endTime" label="结束时间" width="120" align="center" sortable>
      <template #default="scope">
        {{ myFormatDate(scope.row.endTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="创建时间" width="120" align="center" sortable>
      <template #default="scope">
        {{ myFormatDate(scope.row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column prop="isCompleted" label="是否完成" width="120" align="center" sortable>
      <template #default="scope">
        {{ scope.row.isCompleted ? '已完成' : '未完成' }}
      </template>
    </el-table-column>

    <el-table-column prop="description" label="计划描述" show-overflow-tooltip min-width="240" />
    <el-table-column label="学习过程" width="120" align="center">
      <template #default="scope">
        <el-button type="primary" link @click="handleViewProgress(scope.row.id)">
          查看详情
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220" align="center">
      <template #default="scope">
        <div class="action-buttons">
          <el-button type="success" link @click="handleAddProgress(scope.row.id)">记录</el-button>
          <el-button type="primary" link @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
:deep(.table-header) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

:deep(.table-row) {
  transition: background-color 0.3s;
  &:hover {
    background-color: #f1f3f5;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.el-table {
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  :deep(th.el-table__cell) {
    height: 48px;
  }

  :deep(td.el-table__cell) {
    height: 56px;
  }
}
</style>
