import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type {TodoCategory, TodoItem } from '@/types/todo'
import { dayjs, ElMessage } from 'element-plus'
import { apiFetchTodoList, apiUpdateTodo, apiDeleteTodo, apiAddTodo } from '@/api/todo/index.ts'

export const useTodoStore = defineStore('todo', () => {
  // 待办列表
  const todoList = ref<TodoItem[]>([])
  // 当前操作的待办对象
  const currentTodo = reactive<TodoItem>({
    id: Date.now(),
    title: '',
    priority: 'medium',
    deadline: undefined,
    description: '',
    isCompleted: false,
    updatedAt: new Date(),
    repeat: 'none',
  })

  // 表单数据缓存，用于判断表单数据是否发生改变
  const currentTodoCache = ref<TodoItem>()

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
  const getCategory = ({ isCompleted, deadline }: TodoItem) => {
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

  // 重置表单
  const resetTodoForm = () => {
    currentTodo.title = ''
    currentTodo.priority = 'medium'
    currentTodo.deadline = undefined
    currentTodo.description = ''
    currentTodo.isCompleted = false
    currentTodo.repeat = 'none'
  }
  // 切换状态 已完成/待处理
  const toggleTodoStatus = async (todoId: number) => {
    try {
      // 通过ID查找到相应的待办事项，如果没找到则返回
      const todoItem = todoList.value.find((t) => t.id === todoId)
      if (!todoItem) return
      // 切换状态 已完成=>待处理  待处理=>已完成
      const newStatus = !todoItem.isCompleted
      // 向服务器发送更新请求 ...todoItem是对象展开运算符，用于将todoItem对象的所有属性拷贝到新对象中
      await apiUpdateTodo({ ...todoItem, updatedAt: new Date(), isCompleted: newStatus })
      todoItem.isCompleted = newStatus
      todoItem.updatedAt = new Date()
    } catch {
      ElMessage.error('更新失败')
    }
  }

  // 添加待办事项
  const addTodo = async (currentTodo: TodoItem) => {
    try {
      const newTodo = await apiAddTodo({ ...currentTodo, id: Date.now(), updatedAt: new Date()})
      todoList.value.push(newTodo)
    } catch{
      ElMessage.error('添加失败')
    }
  }
  // 更新待办事项
  const updateTodo = async (currentTodo: TodoItem) => {
    try {
      const newTodo = await apiUpdateTodo({...currentTodo, updatedAt: new Date()})
      todoList.value = todoList.value.map((t) => (t.id === newTodo.id ? newTodo : t))
    } catch{
      ElMessage.error('更新失败')
    }
  }
  // 删除待办事项
  const deleteTodo = async (todoId: number) => {
    try {
      await apiDeleteTodo(todoId) // 调用 API
      todoList.value = todoList.value.filter((t) => t.id !== todoId) // 仅当 API 成功时删除前端数据
    } catch {
      ElMessage.error('删除失败，请重试') // 显示错误提示
    }
  }
  return {
    todoList,
    loading,
    currentTodo,
    groupTodoList,
    currentTodoCache,
    getCategory,
    loadTodoList,
    resetTodoForm,
    toggleTodoStatus,
    addTodo,
    updateTodo,
    deleteTodo,
  }
})
