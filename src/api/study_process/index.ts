import type { ProcessItem } from '@/types/process'
// 模拟API接口
// 从服务器加载ProcessMap
export const apiFetchProcessMap = async (): Promise<ProcessItem[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      // 假数据
      resolve([
        {
          id: 501,
          planId: 101,
          content: '数学基础复习',
          endTime: new Date('2025-01-05'),
        },
        { id: 502, planId: 101, content: 'Python机器学习实践', endTime: new Date('2025-02-01') },
        { id: 503, planId: 101, content: '神经网络入门', endTime: new Date('2025-03-15') },
        {
          id: 504,
          planId: 102,
          content: '语法专项训练',
          endTime: new Date('2025-02-10'),
        },
        { id: 505, planId: 102, content: '听力每日练习', endTime: new Date('2025-03-01') },
        {
          id: 506,
          planId: 103,
          content: '项目需求分析',
          endTime: new Date('2025-03-01'),
        },
        { id: 507, planId: 103, content: '数据库设计', endTime: new Date('2025-03-15') },
        { id: 508, planId: 103, content: '支付系统集成', endTime: new Date('2025-04-01') },
        {
          id: 509,
          planId: 106,
          content: '体脂率控制计划',
          endTime: new Date('2025-01-01'),
        },
        { id: 510, planId: 106, content: '每周运动计划', endTime: new Date('2025-01-07') },
        { id: 511, planId: 112, content: '量子位概念学习', endTime: new Date('2025-09-01') },
        { id: 512, planId: 112, content: 'QVisit框架实践', endTime: new Date('2025-10-01') },
        {
          id: 513,
          planId: 115,
          content: '每日晨间冥想',
          endTime: new Date('2025-01-01'),
        },
      ])
    })
  })
export const apiAddProcess = async (studyProcess: ProcessItem): Promise<ProcessItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(studyProcess)
    })
  })

// 更新计划
export const apiUpdateProcess = async (studyProcess: ProcessItem): Promise<ProcessItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(studyProcess)
    })
  })

// 删除待办
export const apiDeleteProcess = async (ProcessId: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    })
  })
