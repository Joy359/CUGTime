import type { Component } from 'vue'
// 待办类型声明
export interface TodoItem {
  id: number // 唯一标识，由前端临时生成，与数据库的id不同。用于快速定位，高效更新
  title: string // 任务标题（必填）
  priority: 'low' | 'medium' | 'high' // 优先级（默认medium）
  description?: string // 任务描述（可选）
  isCompleted: boolean // 是否已完成（默认false）
  deadline?: Date // 截止日期（可选）
  updatedAt: Date //  更新时间
  readmeTime?: Date // 提醒时间（默认为10分钟前，无日期的不进行提醒，用户可自定义）
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' // 重复类型（可选，默认none）暂时未完成
}

// 待办分类 包含 今天、明天、将来、已过期、无日期、已完成
export type TodoCategory = 'today' | 'tomorrow' | 'future' | 'expired' | 'noDate' | 'completed'

// 分类选项
export type CategoryMap = {
  [key in TodoCategory]: {
    label: string
    icon: Component
  }
}
