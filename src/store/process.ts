import { defineStore } from 'pinia'
import type { ProcessItem } from '@/types/process'
import { computed, ref } from 'vue'
import { apiAddProcess, apiFetchProcessMap } from '@/api/study_process'
import { apiDeleteProcess, apiUpdateProcess } from '@/api/study_process'
import { usePlanStore } from '@/store/plan.ts'
import { ElMessage } from 'element-plus'

const planStore = usePlanStore()
export const useProcessStore = defineStore('process', () => {
  // key: planId, value: ProcessItem[]
  const processMap = ref<Map<number, ProcessItem[]>>(new Map())
  const loading = ref(false)
  const currentProcess = ref<ProcessItem>({
    id: Date.now(),
    planId: -1,
    content: '',
    endTime: new Date(''),
  })
  const currentProcessList = computed(() => processMap.value.get(planStore.currentPlan.id) || [])
  const loadProcessMap = async () => {
    // 如果当前正在加载中，直接返回，防止用户频繁操作
    if (loading.value) return
    loading.value = true // 开始加载
    try {
      // 从服务器获取数据 初始化Map
      const processList: ProcessItem[] = await apiFetchProcessMap()
      processMap.value = processList.reduce((map, item) => {
        const group = map.get(item.planId) || []
        return map.set(item.planId, [...group, item])
      }, new Map<number, ProcessItem[]>())
    } finally {
      loading.value = false // 无论成功与否，结束加载
    }
  }
  // 重置表单
  const resetProcessForm = () => {
    currentProcess.value.content = ''
    currentProcess.value.endTime = new Date('')
  }
  const currentProcessCache = ref<ProcessItem>()
  const addProcess = async (currentProcess: ProcessItem) => {
    try {
      const newProcess = await apiAddProcess({
        ...currentProcess,
        id: Date.now(),
        planId: planStore.currentPlan.id,
      })
      processMap.value.set(planStore.currentPlan.id, [
        ...(processMap.value.get(planStore.currentPlan.id) || []),
        newProcess,
      ])
    } catch {
      ElMessage.error('添加失败')
    }
  }

  const updateProcess = async (currentProcess: ProcessItem) => {
    try {
      const newProcess = await apiUpdateProcess(currentProcess)
      processMap.value.set(planStore.currentPlan.id, [
        ...(processMap.value.get(planStore.currentPlan.id) || []),
        newProcess,
      ])
    } catch {
      ElMessage.error('修改失败')
    }
  }

  const deleteProcess = async (processId: number) => {
    try {
      await apiDeleteProcess(processId)
      processMap.value.set(planStore.currentPlan.id, [
        ...(processMap.value.get(planStore.currentPlan.id) || []).filter(
          (item) => item.id !== processId,
        ),
      ])
    } catch {
      ElMessage.error('删除失败')
    }
  }
  return {
    loading,
    processMap,
    currentProcess,
    currentProcessList,
    currentProcessCache,
    deleteProcess,
    addProcess,
    updateProcess,
    loadProcessMap,
    resetProcessForm,
  }
})
