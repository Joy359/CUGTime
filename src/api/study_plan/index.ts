import type { LoadPlanDataType, PlanForm, PlanItem } from '@/types/plan'
import request from '@/utils/request.ts'
// 模拟API接口
// 从服务器加载待办数据
export const apiFetchPlanMap = async (): Promise<LoadPlanDataType> =>
  await request.get(`plans`).then((res) => res.data)
// 添加学习计划
export const apiAddPlan = async (planForm: PlanForm): Promise<PlanItem> =>
  await request.post('plans', planForm).then((res) => res.data)

// 更新学习计划
export const apiUpdatePlan = async (planId: number, planForm: PlanForm): Promise<PlanItem> =>
  await request.put(`plans/${planId}`, planForm).then((res) => res.data)

// 删除学习计划
export const apiDeletePlan = async (planId: number): Promise<number> =>
  await request.delete(`plans/${planId}`).then((res) => res.data)
