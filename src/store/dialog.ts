// 对话框状态管理
import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
  const title = ref('')
  const states = reactive(new Map<string, boolean>())
  // 创建计算属性用于组件绑定
  const visible = (dialogId: string) =>
    computed({
      get: () =>
        states.get(dialogId + '_add') ||
        states.get(dialogId + '_edit') ||
        states.get(dialogId + '_show') ||
        false,
      set: (value: boolean) => {
        states.set(dialogId + '_add', false)
        states.set(dialogId + '_edit', false)
        states.set(dialogId + '_show', false)
        states.set(dialogId, value)
      },
    })
  const open = (dialogId: string, dialogTitle: string) => {
    states.set(dialogId, true)
    title.value = dialogTitle
  }
  const close = (dialogId: string) => {
    states.set(dialogId, false)
  }
  const closeAll = (dialogId: string) => {
    states.set(dialogId + '_add', false)
    states.set(dialogId + '_edit', false)
    states.set(dialogId + '_show', false)
  }
  return {
    states,
    title,
    visible,
    open,
    close,
    closeAll,
  }
})
