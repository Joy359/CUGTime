<script setup lang="ts">
import BaseDialogForm, { type DialogConfig } from '@/components/BaseDialogForm.vue'
import { computed, ref } from 'vue'
import type { PlanForm } from '@/types/plan'
import { useDialogStore } from '@/store/dialog.ts'
import { setDefaultTime } from '@/utils/timeHelper.ts'
import { storeToRefs } from 'pinia'
import { usePlanStore } from '@/store/plan.ts'
import { ElMessage } from 'element-plus'

const dialogStore = useDialogStore()
const planStore = usePlanStore()
const { title } = storeToRefs(dialogStore)
const { getCurrentPlan } = planStore
const dialogVisible = dialogStore.visible('plan')
const planForm = ref<PlanForm>({ isCompleted: false } as PlanForm)
const planDialogConfig = ref<DialogConfig<PlanForm>>({
  title: title,
  formItems: [
    {
      label: '标题',
      prop: 'title',
      type: 'input',
      placeholder: '请输入计划标题',
      required: true,
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: 'datetime',
      required: true,
      dateConfig: {
        valueFormat: 'YYYY-MM-DDTHH:mm',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: 'datetime',
      required: true,
      dateConfig: {
        valueFormat: 'YYYY-MM-DDTHH:mm',
        format: 'YYYY-MM-DD HH:mm',
        defaultTime: setDefaultTime(),
      },
    },
    {
      label: '完成情况',
      prop: 'isCompleted',
      type: 'switch',
      switchConfig: {
        activeText: '已完成',
        inactiveText: '未完成',
      },
    },
    {
      label: '描述',
      prop: 'description',
      type: 'textarea',
      placeholder: '请输入计划描述',
      required: false,
    },
  ],
  submitHandler: async (data) => {
    // 提交数据
    if (dialogVisible.value && dialogStore.mode === 'add') {
      const newPlan = await planStore.addPlan(data)
      ElMessage.success({
        message: `已添加计划：${newPlan.title}`,
        duration: 3000,
      })
    }
    if (dialogVisible.value && dialogStore.mode === 'edit') {
      const newPlan = await planStore.updatePlan(data)
      ElMessage.success({
        message: `已更新计划：${newPlan.title}`,
        duration: 3000,
      })
    }
  },
  cacheCheck: true,
  cacheData: computed(() => getCurrentPlan() as unknown as PlanForm),
})
</script>

<template>
  <BaseDialogForm
    :dialog-type="dialogStore.mode"
    v-model:visible="dialogVisible"
    v-model:form-data="planForm"
    :config="planDialogConfig"
  />
</template>

<style scoped lang="scss"></style>
