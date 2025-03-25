import type { PlanItem } from '@/types/plan'
// 模拟API接口
// 从服务器加载PlanMap
export const apiFetchPlanMap = async (): Promise<PlanItem[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      // 假数据
      resolve([
        {
          id: 101,
          title: '人工智能入门',
          description: '掌握机器学习基础',
          isCompleted: false,
          startTime: new Date('2025-01-05'),
          endTime: new Date('2025-06-30'),
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 102,
          title: '日语N2备考',
          isCompleted: false,
          startTime: new Date('2025-02-10'),
          createdAt: new Date('2024-01-02'),
        },
        {
          id: 103,
          title: '全栈开发实战',
          description: '从零搭建电商平台',
          isCompleted: false,
          startTime: new Date('2025-03-01'),
          endTime: new Date('2025-09-01'),
          createdAt: new Date('2024-01-03'),
        },
        {
          id: 104,
          title: '数字绘画进阶',
          isCompleted: false,
          startTime: new Date('2025-04-15'),
          createdAt: new Date('2024-01-04'),
        },
        {
          id: 105,
          title: '区块链技术研究',
          description: '理解智能合约原理',
          isCompleted: false,
          startTime: new Date('2025-05-01'),
          createdAt: new Date('2024-01-05'),
        },
        {
          id: 106,
          title: '健康管理计划',
          isCompleted: false,
          startTime: new Date('2025-01-01'),
          endTime: new Date('2025-12-31'),
          createdAt: new Date('2024-01-06'),
        },
        {
          id: 107,
          title: '云计算认证准备',
          description: 'AWS解决方案架构师',
          isCompleted: false,
          startTime: new Date('2025-07-01'),
          createdAt: new Date('2024-01-07'),
        },
        {
          id: 108,
          title: '哲学经典阅读',
          isCompleted: false,
          startTime: new Date('2025-03-15'),
          createdAt: new Date('2024-01-08'),
        },
        {
          id: 109,
          title: '智能硬件开发',
          description: '基于Arduino的项目实践',
          isCompleted: false,
          startTime: new Date('2025-06-01'),
          createdAt: new Date('2024-01-09'),
        },
        {
          id: 110,
          title: '金融投资基础',
          isCompleted: false,
          startTime: new Date('2025-04-01'),
          createdAt: new Date('2024-01-10'),
        },
        {
          id: 111,
          title: '3D建模大师课',
          description: 'Blender高级技巧',
          isCompleted: false,
          startTime: new Date('2025-08-15'),
          createdAt: new Date('2024-01-11'),
        },
        {
          id: 112,
          title: '量子计算基础',
          isCompleted: false,
          startTime: new Date('2025-09-01'),
          createdAt: new Date('2024-01-12'),
        },
        {
          id: 113,
          title: '野外生存训练',
          isCompleted: false,
          startTime: new Date('2025-05-20'),
          createdAt: new Date('2024-01-13'),
        },
        {
          id: 114,
          title: '音乐制作入门',
          description: '使用Ableton Live',
          isCompleted: false,
          startTime: new Date('2025-10-10'),
          createdAt: new Date('2024-01-14'),
        },
        {
          id: 115,
          title: '冥想习惯养成',
          isCompleted: false,
          startTime: new Date('2025-01-01'),
          createdAt: new Date('2024-01-15'),
        },
      ])
    })
  })

// 添加计划
export const apiAddPlan = async (studyPlan: PlanItem): Promise<PlanItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(studyPlan)
    })
  })

// 更新计划
export const apiUpdatePlan = async (studyPlan: PlanItem): Promise<PlanItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(studyPlan)
    })
  })

// 删除计划
export const apiDeletePlan = async (PlanId: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    })
  })
