<script setup lang="ts">
import { useDialogStore } from '@/store/dialog.ts'
import { useProcessStore } from '@/store/process.ts'
import { myFormatDate, setDefaultTime } from '@/utils/timeHelper.ts'
import { usePlanStore } from '@/store/plan.ts'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { ProcessForm } from '@/types/process'
import BaseDialogForm, { type DialogConfig } from '@/components/BaseDialogForm.vue'

const processStore = useProcessStore()
const planStore = usePlanStore()
const dialogStore = useDialogStore()
const { title } = storeToRefs(dialogStore)
const { getCurrentProcess } = processStore
const dialogVisible = dialogStore.visible('process')
const dialogShowVisible = dialogStore.visible('processView')

const processForm = ref<ProcessForm>({} as ProcessForm)
const processDialogConfig = ref<DialogConfig<ProcessForm>>({
  title: title,
  formItems: [
    {
      label: '学习内容',
      prop: 'content',
      type: 'input',
      placeholder: '请输入学习内容',
      required: true,
    },
    {
      label: '完成时间',
      prop: 'completedTime',
      type: 'datetime',
      required: true,
      dateConfig: {
        valueFormat: 'YYYY-MM-DDTHH:mm',
        format: 'YYYY-MM-DD HH:mm',
        defaultTime:  setDefaultTime(),
      },
    },
  ],
  submitHandler: async (data) => {
    // 提交数据
    if (dialogStore.mode === 'add') {
      const newProcess = await processStore.addProcess(data)
      ElMessage.success({
        message: `记录成功：${planStore.getCurrentPlan()?.title} ==> ${newProcess.content}`,
        duration: 3000,
      })
    }
    if (dialogStore.mode === 'edit') {
      const newProcess = await processStore.updateProcess(data)
      ElMessage.success({
        message: `更新成功 ==> ${planStore.getCurrentPlan()?.title} ==> ${newProcess.content}`,
        duration: 3000,
      })
    }
  },
  cacheCheck: true,
  cacheData: computed(() => getCurrentProcess() as unknown as ProcessForm),
})
</script>

<template>
  <!-- 添加/编辑学习过程的对话框-->
  <BaseDialogForm
    v-model:visible="dialogVisible"
    :dialog-type="dialogStore.mode"
    v-model:form-data="processForm"
    :config="processDialogConfig"
  ></BaseDialogForm>
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
          :timestamp="myFormatDate(item.completedTime)"
          placement="top"
          :default-time="setDefaultTime()"
          type="success"
        >
          <el-card>
            <el-text type="primary">学习计划：{{ planStore.getCurrentPlan()?.title }}</el-text>
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
