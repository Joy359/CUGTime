import { defineStore } from 'pinia'
import type { ProcessForm, ProcessItem } from '@/types/process'
import { computed, ref } from 'vue'
import { apiAddProcess, apiFetchProcessMap } from '@/api/study_process'
import { apiDeleteProcess, apiUpdateProcess } from '@/api/study_process'
import { usePlanStore } from '@/store/plan.ts'
import { ElMessage } from 'element-plus'

export const useProcessStore = defineStore('process', () => {
  // key: planId, value: ProcessItem[]
  const processMap = ref<Map<number, ProcessItem[]>>(new Map())
  const currentProcessId = ref(0)
  const loading = ref(false)
  const planStore = usePlanStore()
  const currentProcessList = computed(() => processMap.value.get(planStore.currentPlanId) || [])
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

  const addProcess = async (processForm: ProcessForm) => {
    const newProcess = await apiAddProcess(planStore.currentPlanId, processForm)
    console.log('addProcess', newProcess)
    processMap.value.get(newProcess.planId)?.push(newProcess)
    return newProcess
  }

  const updateProcess = async (processForm: ProcessForm) => {
    const newProcess = await apiUpdateProcess(
      planStore.currentPlanId,
      currentProcessId.value,
      processForm,
    )
    const processes = processMap.value.get(planStore.currentPlanId) || []
    const target = processes.find((item) => item.id === newProcess.id)
    if (target) Object.assign(target, newProcess)
    return newProcess
  }

  const deleteProcess = async (processId: number) => {
    try {
      await apiDeleteProcess(planStore.currentPlanId, processId)
      // 获取当前计划的流程列表
      const planId = planStore.currentPlanId
      const processes = processMap.value.get(planId) || []
      //  创建过滤后的新数组
      const updatedProcesses = processes.filter((item) => item.id !== processId)

      // 更新Map（保持响应式）
      processMap.value.set(planId, updatedProcesses)
    } catch {
      ElMessage.error('删除失败')
    }
  }
  // 获取当前的学习过程
  const getCurrentProcess = () => {
    const processList = processMap.value.get(planStore.currentPlanId) || []
    return processList.find((item) => item.id === currentProcessId.value)
  }
  return {
    loading,
    processMap,
    currentProcessList,
    currentProcessId,
    deleteProcess,
    addProcess,
    updateProcess,
    loadProcessMap,
    getCurrentProcess,
  }
})
