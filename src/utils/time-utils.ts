// 日期格式化逻辑
import { dayjs } from 'element-plus'

// 自定义日期格式化函数
// 显示月份，日期，时分 如果时间不是今年，显示年份
export const myFormatDate = (data: Date) => {
  const now = dayjs()
  const taskDate = dayjs(data)

  // 显示规则
  let formatString = 'MM-DD HH:mm'

  // 添加年份判断
  if (taskDate.year() !== now.year()) {
    formatString = 'YYYY-' + formatString
  }
  return taskDate.format(formatString)
}

// 设置日期时间选择器中的默认时间
// 当用户仅选择日期未选择时间时，会自动设为23:59:59
// 避免用户当日制定的待办被归为已过期
export const setDefaultTime = () => {
  const selectedDate = new Date()
  return new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59,
  )
}

// 时间判断方法
// 判断是否为最近更新
export const isRecentUpdate = (date: Date) => {
  const now = new Date().getTime()
  const updateTime = new Date(date).getTime()
  return now - updateTime < 5 * 60 * 1000 // 5分钟内显示标记
}
