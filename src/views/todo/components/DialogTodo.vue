<script setup lang="ts">
import { useTodoStore } from '@/store/todo.ts'
import { storeToRefs } from 'pinia'
import type { CategoryMap, TodoForm } from '@/types/todo'
import { Bell, Calendar, CircleCheck, Refresh, Warning } from '@element-plus/icons-vue'
import { setDefaultTime } from '@/utils/timeHelper.ts'
import { useDialogStore } from '@/store/dialog.ts'
import { computed, ref } from 'vue'
import BaseDialogForm, { type DialogConfig } from '@/components/BaseDialogForm.vue'
import { ElMessage } from 'element-plus'
const dialogStore = useDialogStore()
const todoStore = useTodoStore()
const { title } = storeToRefs(dialogStore)
const { getCurrentTodo } = todoStore
const { getCategory } = useTodoStore()
const dialogVisible = dialogStore.visible('todo')
const todoForm = ref<TodoForm>({ priority: 'medium', isCompleted: false } as TodoForm)
const todoDialogConfig = ref<DialogConfig<TodoForm>>({
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
      label: '优先级',
      prop: 'priority',
      type: 'radio',
      options: [
        { label: '忽略', value: 'low' },
        { label: '普通', value: 'medium' },
        { label: '重要', value: 'high' },
      ],
      required: true,
    },
    {
      label: '完成情况',
      prop: 'isCompleted',
      type: 'switch',
      switchConfig: {
        activeText: '已完成',
        inactiveText: '未完成',
      },
      required: true,
    },
    {
      label: '截止日期',
      prop: 'deadline',
      type: 'datetime',
      dateConfig: {
        valueFormat: 'YYYY-MM-DDTHH:mm',
        format: 'YYYY-MM-DD HH:mm',
        defaultTime: setDefaultTime(),
        placement: 'right-start',
      },
      required: false,
    },
    {
      label: '提醒时间',
      prop: 'reminderTime',
      type: 'select',
      required: false,
      options: [
        { label: '无', value: 0 },
        { label: '准时', value: 0 },
        { label: '5分钟前', value: 5 },
        { label: '10分钟前', value: 10 },
        { label: '15分钟前', value: 15 },
        { label: '30分钟前', value: 30 },
        { label: '1小时前', value: 60 },
        { label: '2小时前', value: 120 },
        { label: '一周前', value: 10080 },
        { label: '自定义', value: -1 },
      ],
      // 动态显示逻辑
      visible: computed(() => !!todoForm.value.deadline),
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
    if (dialogStore.mode === 'add') {
      const newTodo = await todoStore.addTodo(data)
      console.log('newTodo', newTodo)
      ElMessage.success({
        message: `已添加任务：${newTodo.title} ==> ${categoryMap[getCategory(newTodo)].label}`,
        duration: 3000,
      })
    }
    if (dialogStore.mode === 'edit') {
      console.log(data)
      const newTodo = await todoStore.updateTodo(data)
      ElMessage.success({
        message: `已更新任务：${newTodo.title} ===> ${categoryMap[getCategory(newTodo)].label}`,
        duration: 3000,
      })
    }
  },
  cacheCheck: true,
  cacheData: computed(() => getCurrentTodo() as unknown as TodoForm),
})

const categoryMap: CategoryMap = {
  today: { label: '今日任务', icon: Calendar },
  tomorrow: { label: '明日任务', icon: Bell },
  future: { label: '未来任务', icon: Refresh },
  expired: { label: '已过期', icon: Warning },
  noDate: { label: '无日期', icon: CircleCheck },
  completed: { label: '已完成', icon: CircleCheck },
}
</script>

<template>
  <BaseDialogForm
    :dialog-type="dialogStore.mode"
    v-model:visible="dialogVisible"
    v-model:form-data="todoForm"
    :config="todoDialogConfig"
  ></BaseDialogForm>
</template>

<style scoped lang="scss"></style>
