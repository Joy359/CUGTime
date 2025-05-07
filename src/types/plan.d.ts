// 学习计划类型声明 基础数据模型，也是后端返回的基础数据类型
export interface PlanItem {
  id: number // 自增主键 正整数
  title: string // 计划标题（非空）
  startTime: string // 开始时间（非空  ISO 8601 标准格式字符串）
  endTime: string // 结束时间（非空  ISO 8601 标准格式字符串）
  isCompleted: boolean // 是否已完成（非空）默认false
  createdAt: string // 创建时间（非空， ISO 8601 标准格式字符串）系统自动维护
  description?: string // 计划描述（可选）
}
// 表单专用模型 优化前端交互，同时也是发送给后端的数据类型
export interface PlanForm {
  title: string
  startTime: string
  endTime: string
  isCompleted: boolean
  description?: string
}
// 加载用户学习计划时服务器返回的数据类型
export type LoadPlanDataType = PlanItem[]

// 添加学习计划时服务器返回的数据类型

// 更新学习计划时服务器返回的数据类型

// 删除学习计划时服务器返回的数据类型
