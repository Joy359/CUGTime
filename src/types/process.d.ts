// 学习过程 基础数据模型，也是后端返回的基础数据类型
export interface ProcessItem {
  id: number // // 自增主键 正整数
  planId: number // 关联的计划id
  content: string // 进度内容（必填）
  completedTime: string // 完成时间（必填, ISO 8601标准格式字符串）
  createdAt: string // 创建时间（系统自动维护）
}

// 表单专用模型 优化前端交互，同时也是发送给后端的数据类型
export interface ProcessForm {
  content: string
  completedTime: string
}

// 加载用户学习计划时服务器返回的数据类型
export type LoadProcessDataType = PlanItem[]

