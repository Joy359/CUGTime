import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TodoCategory, TodoForm, TodoItem } from '@/types/todo'
import { dayjs } from 'element-plus'
import { apiFetchTodoList, apiUpdateTodo, apiDeleteTodo, apiAddTodo } from '@/api/todo/index.ts'
import { covertDeadlineAndReminderTime } from '@/utils/timeHelper.ts'

export const useTodoStore = defineStore('todo', () => {
  // 待办列表
  const todoList = ref<TodoItem[]>([])
  const currentTodoId = ref(0)

  // loading 表示应用是否在从服务器加载数据
  // 页面初次加载，用户刷新数据，提交表单后，loading均为true
  // 如果用户多次点击刷新按钮，loading 可以阻止重复发送请求; 可以显示“加载中”的动画或提示
  const loading = ref(false)

  // 分类逻辑 对一个TodoItem进行分类
  // 已完成(优先级最高) => completed
  // 无截止日期(未完成且无截止日期) => noDate
  // 已过期(未完成且已过截止日期) => expired
  // 今日(未完成且今天截止) => today
  // 明日(未完成且明天截止) => tomorrow
  // 即将(未完成且未来截止) => future
  const getCategory = ({ isCompleted, deadline }: TodoItem | TodoForm) => {
    const now = dayjs()
    const todoDate = dayjs(deadline)
    if (isCompleted) return 'completed'
    else if (!deadline) return 'noDate'
    else if (todoDate.isBefore(now)) return 'expired'
    else if (todoDate.isSame(now, 'day')) return 'today'
    else if (todoDate.isSame(now.add(1, 'day'), 'day')) return 'tomorrow'
    else return 'future'
  }

  // 对todoList进行分类, 结果返回一个对象
  // key为分类名, completed, noDate, expired, today, tomorrow, future
  // value为对应的数组, 每一项都是TodoItem, 存储分类后的结果
  const groupTodoList = computed(() => {
    // Recode<TodoCategory, TodoItem[]> 强制键类型为TodoCategory, 值类型为TodoItem[]，更严格的类型定义
    const groups: Record<TodoCategory, TodoItem[]> = {
      today: [],
      tomorrow: [],
      future: [],
      expired: [],
      noDate: [],
      completed: [],
    }
    todoList.value.forEach((todoItem) => {
      const category = getCategory(todoItem)
      groups[category].push(todoItem)
    })
    return groups
  })
  // 加载TodoList
  const loadTodoList = async () => {
    // 如果当前正在加载中，直接返回，防止用户频繁操作
    if (loading.value) return
    loading.value = true // 开始加载
    try {
      // 从服务器获取数据
      todoList.value = await apiFetchTodoList()
    } finally {
      loading.value = false // 无论成功与否，结束加载
    }
  }

  // 切换状态 已完成/待处理
  const toggleTodoStatus = async (todoId: number) => {
    // 通过ID查找到相应的待办事项，如果没找到则返回
    const todoItem = todoList.value.find((t) => t.id === todoId)
    if (!todoItem) return
    // 切换状态 已完成=>待处理  待处理=>已完成
    const newStatus = !todoItem.isCompleted
    // 向服务器发送更新请求 ...todoItem是对象展开运算符，用于将todoItem对象的所有属性拷贝到新对象中
    await apiUpdateTodo(todoId, { ...todoItem, isCompleted: newStatus } as TodoForm)
    todoItem.isCompleted = newStatus
    todoItem.updatedAt = new Date().toISOString()
  }

  // 添加待办事项
  const addTodo = async (todoForm: TodoForm) => {
    const { deadline, reminderTime } = covertDeadlineAndReminderTime(
      todoForm.deadline,
      todoForm.reminderTime,
    )
    const newTodo = await apiAddTodo({
      ...todoForm,
      deadline: deadline,
      reminderTime: reminderTime,
    })
    todoList.value.push(newTodo)
    return newTodo
  }
  // 更新待办事项
  const updateTodo = async (todoForm: TodoForm) => {
    const { deadline, reminderTime } = covertDeadlineAndReminderTime(
      todoForm.deadline,
      todoForm.reminderTime,
    )
    const newTodo = await apiUpdateTodo(currentTodoId.value, {
      ...todoForm,
      deadline: deadline,
      reminderTime: reminderTime,
    })
    todoList.value = todoList.value.map((t) => (t.id === newTodo.id ? newTodo : t))
    return newTodo
  }
  // 删除待办事项
  const deleteTodo = async (todoId: number) => {
    const resId = await apiDeleteTodo(todoId) // 调用 API
    todoList.value = todoList.value.filter((t) => t.id !== resId)
  }
  // 获取当前待办事项
  const getCurrentTodo = () => todoList.value.find((t) => t.id === currentTodoId.value)
  return {
    todoList,
    loading,
    groupTodoList,
    currentTodoId,
    getCategory,
    loadTodoList,
    toggleTodoStatus,
    addTodo,
    updateTodo,
    deleteTodo,
    getCurrentTodo,
  }
})
