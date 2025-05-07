// 对话框状态管理
import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'

type DialogMode = 'add' | 'edit' | ''
export const useDialogStore = defineStore('dialog', () => {
  const title = ref('')
  const states = reactive(new Map<string, boolean>())
  const mode = ref<DialogMode>('add')
  // 创建计算属性用于组件绑定
  const visible = (prefix: string) =>
    computed({
      get: () => states.get(prefix + '_' + mode.value) || false,
      set: (value: boolean) => {
        states.set(prefix + '_' + mode.value, value)
      },
    })
  const open = (prefix: string, dialogMode: DialogMode, dialogTitle: string) => {
    title.value = dialogTitle
    mode.value = dialogMode
    states.set(prefix + '_' + dialogMode, true)
  }
  const close = (prefix: string, dialogMode: DialogMode) => {
    states.set(prefix + '_' + dialogMode, false)
  }
  const closeAll = (prefix: string) => {
    states.set(prefix + '_add', false)
    states.set(prefix + '_edit', false)
    states.set(prefix + '_show', false)
  }
  return {
    states,
    title,
    mode,
    visible,
    open,
    close,
    closeAll,
  }
})
