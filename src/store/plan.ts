import { defineStore } from 'pinia'
import type { PlanItem } from '@/types/plan'
import { ref, reactive } from 'vue'
import { apiFetchPlanMap, apiAddPlan, apiUpdatePlan, apiDeletePlan } from '@/api/study_plan'
import { ElMessage } from 'element-plus'

export const usePlanStore = defineStore('plan', () => {
  const planMap = ref<Map<number, PlanItem>>(new Map())
  const loading = ref(false)
  // 表单数据
  const currentPlan = reactive<PlanItem>({
    id: Date.now(),
    title: '',
    description: '',
    isCompleted: false,
    startTime: undefined,
    endTime: undefined,
    createdAt: new Date(),
  })
  // 表单数据缓存，用于判断表单数据是否发生改变
  const currentPlanCache = ref<PlanItem>()
  // 重置表单
  const resetPlanForm = () => {
    currentPlan.title = ''
    currentPlan.startTime = undefined
    currentPlan.endTime = undefined
    currentPlan.description = ''
    currentPlan.isCompleted = false
    currentPlan.createdAt = new Date()
  }
  const loadPlanMap = async () => {
    // 如果当前正在加载中，直接返回，防止用户频繁操作
    if (loading.value) return
    loading.value = true // 开始加载
    try {
      // 从服务器获取数据
      const planList = await apiFetchPlanMap()
      planMap.value = new Map(planList.map((plan) => [plan.id, plan]))
    } finally {
      loading.value = false // 无论成功与否，结束加载
    }
  }
  // 添加待办事项
  const addPlan = async (currentPlan: PlanItem) => {
    try {
      const newPlan = await apiAddPlan({ ...currentPlan, id: Date.now(), createdAt: new Date() })
      planMap.value.set(newPlan.id, newPlan)
    } catch {
      ElMessage.error('添加失败')
    }
  }
  // 更新学习计划
  const updatePlan = async (currentPlan: PlanItem) => {
    try {
      const newPlan = await apiUpdatePlan({ ...currentPlan })
      planMap.value.set(currentPlan.id, newPlan)
    } catch {
      ElMessage.error('更新失败')
    }
  }
  // 删除学习计划
  const deletePlan = async (planId: number) => {
    try {
      await apiDeletePlan(planId) // 调用 API
      planMap.value.delete(planId)
    } catch {
      ElMessage.error('删除失败，请重试') // 显示错误提示
    }
  }
  return {
    planMap,
    loading,
    currentPlan,
    currentPlanCache,
    loadPlanMap,
    resetPlanForm,
    addPlan,
    updatePlan,
    deletePlan,
  }
})
