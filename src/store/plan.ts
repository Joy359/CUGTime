import { defineStore } from 'pinia'
import type { PlanForm, PlanItem } from '@/types/plan'
import { ref, computed } from 'vue'
import { apiAddPlan, apiDeletePlan, apiFetchPlanMap, apiUpdatePlan } from '@/api/study_plan'
import { useProcessStore } from '@/store/process.ts'
import { dayjs } from 'element-plus'

export const usePlanStore = defineStore('plan', () => {
  const planMap = ref<Map<number, PlanItem>>(new Map())
  const loading = ref(false)
  const currentPlanId = ref(0)
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
  // 添加学习计划
  const addPlan = async (planForm: PlanForm) => {
    const newPlan = await apiAddPlan(planForm)
    planMap.value.set(newPlan.id, newPlan)
    return newPlan
  }
  // 更新学习计划
  const updatePlan = async (planForm: PlanForm) => {
    const newPlan = await apiUpdatePlan(currentPlanId.value, planForm)
    planMap.value.set(newPlan.id, newPlan)
    return newPlan
  }
  // 删除学习计划
  const deletePlan = async (planId: number) => {
    const resId = await apiDeletePlan(planId) // 调用 API
    planMap.value.delete(resId)
    // 删除所有关联的学习过程
    const processStore = useProcessStore()
    processStore.processMap.delete(resId)
  }
  // 根据id获取当前数据
  const getCurrentPlan = () => planMap.value.get(currentPlanId.value)

  // 通过id查询
  const getPlanById = (planId: number) => planMap.value.get(planId)

  // 获取包含今日的学习计划 进行中计划
  const inTodayPlans = computed(() => {
    const now = dayjs()
    return Array.from(planMap.value.values()).filter((plan) => {
      const start = dayjs(plan.startTime).startOf('day')
      const end = dayjs(plan.endTime).endOf('day')
      const current = now.startOf('day')

      // 分解为两个独立判断：
      // 1. 当前日期 >= 开始日期
      // 2. 当前日期 <= 结束日期
      return (
        (current.isAfter(start) || current.isSame(start)) &&
        (current.isBefore(end) || current.isSame(end))
      )
    })
  })

  // 获取今日的学习计划
  const todayPlans = computed(() => {
    const now = dayjs()
    const todayStart = now.startOf('day') // 当日00:00:00
    const todayEnd = now.endOf('day') // 当日23:59:59

    return Array.from(inTodayPlans.value).filter((plan) => {
      const planStart = dayjs(plan.startTime)
      const planEnd = dayjs(plan.endTime)
      // 计划时间段完全在今日范围内
      return planStart >= todayStart && planEnd <= todayEnd
    })
  })
  // 获取所有未完成计划（用于顶部统计）
  const allUncompletedPlans = computed(() =>
    Array.from(planMap.value.values()).filter((p) => !p.isCompleted),
  )

  // 获取今日所有计划（包含已完成）
  const todayAllPlans = computed(() => {
    const today = dayjs().startOf('day')
    return Array.from(planMap.value.values())
      .filter((p) => dayjs(p.startTime).isSame(today, 'day'))
      .sort((a, b) => {
        // 先按未完成排序，再按开始时间排序
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1
        }
        return dayjs(a.startTime).unix() - dayjs(b.startTime).unix()
      })
  })

  return {
    planMap,
    loading,
    currentPlanId,
    todayPlans,
    inTodayPlans,
    loadPlanMap,
    addPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    getCurrentPlan,
    allUncompletedPlans,
    todayAllPlans,
  }
})
