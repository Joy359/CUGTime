<script setup lang="ts">
import { useDialogStore } from '@/store/dialog.ts'
import { useProcessStore } from '@/store/process.ts'
import { myFormatDate, setDefaultTime } from '@/utils/time-utils.ts'
import { usePlanStore } from '@/store/plan.ts'
import { ElMessage } from 'element-plus'
import { isEqual } from 'lodash-es'
import { storeToRefs } from 'pinia'

const processStore = useProcessStore()
const planStore = usePlanStore()
const dialogStore = useDialogStore()
const { currentProcess, currentProcessCache } = storeToRefs(processStore)
const { currentPlan, planMap } = storeToRefs(planStore)
const dialogUpdateVisible = dialogStore.visible('process')
const dialogShowVisible = dialogStore.visible('')

let warningMessage: { close: () => void } | null = null
const handleAddProcess = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentProcess.value.content) {
    warningMessage = ElMessage.warning('请填写内容')
    return
  }
  processStore.addProcess(currentProcess.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `添加成功 ==> ${planMap.value.get(currentPlan.value.id)?.title}`,
      duration: 3000,
    })
    dialogStore.close('process_add')
  })
}

const handleEditProcess = () => {
  // 清除已有警告提示
  if (warningMessage) {
    warningMessage.close()
  }
  if (!currentProcess.value.content) {
    ElMessage.warning('请填写内容')
    return
  }
  if (isEqual(currentProcess.value, currentProcessCache.value)) {
    warningMessage = ElMessage.warning('未作任何修改')
    return
  }
  processStore.updateProcess(currentProcess.value).then(() => {
    warningMessage = null
    ElMessage.success({
      message: `更新成功 ==> ${planMap.value.get(currentPlan.value.id)?.title}`,
      duration: 3000,
    })
    dialogStore.close('process_edit')
  })
}
</script>

<template>
  <!--  更新学习过程的对话框-->
  <el-dialog v-model="dialogUpdateVisible" class="my-global-dialog" :title="dialogStore.title">
    <el-form class="my-global-form">
      <el-form-item label="内容" required>
        <el-input
          type="textarea"
          v-model="processStore.currentProcess.content"
          placeholder="请输入过程内容"
        />
      </el-form-item>
      <el-form-item label="时间" required>
        <el-date-picker
          v-model="processStore.currentProcess.endTime"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY/MM/DD HH:mm"
          placement="bottom-end"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogStore.closeAll('process')">取消</el-button>
      <el-button
        type="primary"
        @click="handleAddProcess"
        v-if="dialogStore.title === '记录学习过程'"
      >
        确认添加
      </el-button>
      <el-button type="primary" @click="handleEditProcess" v-else>确认更新</el-button>
    </template>
  </el-dialog>

  <!--  展示学习过程的对话框-->
  <el-dialog
    v-model="dialogShowVisible"
    class="my-global-dialog"
    title="学习过程"
    style="width: 700px"
  >
    <template v-if="processStore.currentProcessList?.length">
      <el-timeline>
        <el-timeline-item
          v-for="item in processStore.currentProcessList"
          :key="item.id"
          :timestamp="myFormatDate(item.endTime)"
          placement="top"
          :default-time="setDefaultTime()"
          type="success"
        >
          <el-card>
            <el-text type="primary">学习计划：{{ planMap.get(currentPlan.id)?.title }}</el-text>
            <br />
            <span style="font-weight: bold">学习过程：</span>
            <span class="content">{{ item.content }}</span>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <el-empty v-else description="暂无学习过程记录" :image-size="120" class="custom-empty" />
  </el-dialog>
</template>

<style scoped lang="scss"></style>
