<script setup lang="ts">
import { computed } from 'vue'
import { myFormatDate } from '@/utils/timeHelper.ts'
import { useProcessStore } from '@/store/process.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ProcessItem } from '@/types/process'
import { usePlanStore } from '@/store/plan.ts'
import { useDialogStore } from '@/store/dialog.ts'
const processStore = useProcessStore()
const dialogStore = useDialogStore()
const planStore = usePlanStore()
const tableData = computed(() => Array.from(processStore.processMap.values()).flat())

const handleDelete = (processItem: ProcessItem) => {
  ElMessageBox.confirm('确定永久删除该过程？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    distinguishCancelAndClose: true,
  }).then(() => {
    planStore.currentPlanId = processItem.planId
    processStore.deleteProcess(processItem.id)
    ElMessage.success('删除成功')
  })
}
const handleEdit = (planId: number, processId:number) => {
  planStore.currentPlanId = planId
  processStore.currentProcessId = processId
  dialogStore.open('process', 'edit','编辑学习过程')
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
    <el-table-column prop="processId" label="计划标题" align="center">
      <template #default="scope">
        {{ planStore.planMap.get(scope.row.planId)?.title }}
      </template>
    </el-table-column>
    <el-table-column prop="endTime" label="完成时间" sortable align="center">
      <template #default="scope">
        {{ myFormatDate(scope.row.endTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="创建时间" sortable align="center">
      <template #default="scope">
        {{ myFormatDate(scope.row.createdAt) }}
      </template>
    </el-table-column>
    <el-table-column prop="content" label="学习内容" align="center" show-overflow-tooltip/>
    <el-table-column label="操作" width="220" align="center">
      <template #default="scope">
        <div class="action-buttons">
          <el-button type="primary" link @click="handleEdit(scope.row.planId, scope.row.id)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
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
