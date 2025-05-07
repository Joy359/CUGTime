import type { Component } from 'vue'
// 待办类型声明 基础数据模型，也是后端返回的基础数据类型
export interface TodoItem {
  id: number // 自增主键 正整数
  title: string // 待办标题（非空）
  priority: 'low' | 'medium' | 'high' // 优先级（非空）默认medium
  isCompleted: boolean // 是否已完成（非空）默认false
  updatedAt: string //  更新时间（非空 ISO 8601 标准格式字符串）系统自动维护
  deadline?: string // 截止日期（可选）
  reminderTime?: string | null // 提醒时间（可选 ISO 8601 标准格式字符串）若有截止日期，默认为截止日期的30分钟前，无日期或空值则不进行提醒）
  description?: string // 任务描述（可选）
}
// 表单专用模型 优化前端交互，同时也是发送给后端的数据类型
export interface TodoForm {
  title: string
  priority: 'low' | 'medium' | 'high'
  isCompleted: boolean
  description?: string
  deadline?: string
  reminderTime?: number | string | null
}
// 加载用户待办时服务器返回的数据类型
export type LoadTodoDataType = TodoItem[]
// 待办分类 包含 今天、明天、将来、已过期、无日期、已完成 由前端维护
export type TodoCategory = 'today' | 'tomorrow' | 'future' | 'expired' | 'noDate' | 'completed'

// 分类选项
export type CategoryMap = {
  [key in TodoCategory]: {
    label: string
    icon: Component
  }
}
