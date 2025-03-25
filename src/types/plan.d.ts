// 学习计划类型声明
export interface PlanItem {
  id: number // 唯一标识，由前端临时生成，与数据库的id不同。用于快速定位，高效更新
  title: string // 计划标题（必填）
  description?: string // 计划描述（可选）
  isCompleted: boolean // 是否已完成（默认false）
  startTime?: Date  // 开始时间（可选）
  endTime?: Date // 结束时间（可选）
  createdAt: Date // 创建时间（系统自动维护）
}
