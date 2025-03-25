<script setup lang="ts">
import { usePlanStore } from '@/store/plan.ts'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog.ts'
import { ElMessage } from 'element-plus'
import { setDefaultTime } from '@/utils/time-utils.ts'
import { isEqual } from 'lodash-es'

const planStore = usePlanStore()
const dialogStore = useDialogStore()
const { currentPlan, currentPlanCache } = storeToRefs(planStore)
const dialogVisible = dialogStore.visible('plan')
let warningMessage: { close: () => void } | null = null
const handleAddPlan = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentPlan.value.title) {
    warningMessage = ElMessage.warning('请填写标题')
    return
  }
  if (
    currentPlan.value.startTime &&
    currentPlan.value.endTime &&
    currentPlan.value.startTime > currentPlan.value.endTime
  ) {
    warningMessage = ElMessage.warning('开始时间不能大于结束时间')
    return
  }
  planStore.addPlan(currentPlan.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `已添加任务：${currentPlan.value.title}`,
      duration: 3000,
    })
    dialogStore.close('plan_add')
  })
}

const handleEditPlan = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentPlan.value.title) {
    ElMessage.warning('请填写标题')
    return
  }
  if (isEqual(currentPlan.value, currentPlanCache.value)) {
    warningMessage = ElMessage.warning('未作任何修改')
    return
  }
  if (
    currentPlan.value.startTime &&
    currentPlan.value.endTime &&
    currentPlan.value.startTime > currentPlan.value.endTime
  ) {
    ElMessage.warning('开始时间不能大于结束时间')
    return
  }
  planStore.updatePlan(currentPlan.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `已更新任务：${currentPlan.value.title}`,
      duration: 3000,
    })
    dialogStore.close('plan_edit')
  })
}
</script>

<template>
  <el-dialog v-model="dialogVisible" class="my-global-dialog" :title="dialogStore.title" >
    <el-form :model="currentPlan" class="my-global-form">
      <el-form-item label="计划标题" required>
        <el-input v-model="currentPlan.title" placeholder="请输入计划标题"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="currentPlan.startTime"
          type="datetime"
          format="YYYY/MM/DD HH:mm"
          placeholder="选择开始时间"
          placement="right-start"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="currentPlan.endTime"
          type="datetime"
          format="YYYY/MM/DD HH:mm"
          :default-time="setDefaultTime()"
          placeholder="选择结束时间"
          placement="right-start"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="currentPlan.isCompleted" active-text="已完成" inactive-text="进行中" />
      </el-form-item>
      <el-form-item label="计划描述">
        <el-input
          v-model="currentPlan.description"
          placeholder="请输入计划描述"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogStore.closeAll('plan')">取消</el-button>
      <el-button type="primary" @click="handleAddPlan" v-if="dialogStore.title === '新建计划'">
        确认添加
      </el-button>
      <el-button type="primary" @click="handleEditPlan" v-else>确认更新</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss"></style>
