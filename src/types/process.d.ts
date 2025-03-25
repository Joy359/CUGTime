// 学习过程
export interface ProcessItem {
  id: number // 唯一标识，由前端临时生成，与数据库的id不同。用于快速定位，高效更新
  planId: number // 关联的计划id
  content: string // 进度内容（必填）
  endTime: Date  // 结束时间（必填）
}
