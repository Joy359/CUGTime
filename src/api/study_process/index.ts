import type { LoadProcessDataType, ProcessForm, ProcessItem } from '@/types/process'
import request from '@/utils/request.ts'
// 模拟API接口
// 从服务器加载ProcessMap
export const apiFetchProcessMap = async (): Promise<LoadProcessDataType> =>
  await request.get(`plans/processes`).then((res) => res.data)

// 添加学习过程
export const apiAddProcess = async (planId:number,processForm: ProcessForm): Promise<ProcessItem> =>
  await request.post(`plans/${planId}/processes`, processForm).then((res) => res.data)

// 更新学习过程
export const apiUpdateProcess = async (planId:number, processId:number, processForm: ProcessForm): Promise<ProcessItem> =>
  await request.put(`plans/${planId}/processes/${processId}`, processForm).then((res) => res.data)

// 删除学习过程
export const apiDeleteProcess = async (planId:number,ProcessId: number): Promise<void> =>
  await request.delete(`plans/${planId}/processes/${ProcessId}`).then((res) => res.data)
