import type { TodoItem } from '@/types/todo'

// 模拟API接口
// 从服务器加载TodoList
export const apiFetchTodoList = async (): Promise<TodoItem[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      // 假数据
      resolve([
        {
          id: 1,
          title: '学习React',
          priority: 'high',
          deadline: new Date('2023-06-15 18:00'),
          isCompleted: true,
          updatedAt: new Date('2023-06-15 18:00'),
        },
        {
          id: 2,
          title: '学习Vue',
          priority: 'high',
          deadline: new Date('2025-03-20 18:00'),
          isCompleted: false,
          updatedAt: new Date('2025-02-20 18:00'),
        },
        {
          id: 3,
          title: '学习Java',
          priority: 'high',
          deadline: new Date('2025-03-21 18:00'),
          isCompleted: true,
          updatedAt: new Date('2025-02-21 18:00'),
        },
        {
          id: 4,
          title: '学习Python',
          priority: 'high',
          deadline: new Date('2025-03-28 18:00'),
          isCompleted: false,
          updatedAt: new Date('2025-02-28 18:00'),
        },
        {
          id: 5,
          title: '学习C++',
          priority: 'medium',
          deadline: new Date('2025-03-22 18:00'),
          isCompleted: false,
          updatedAt: new Date('2025-02-22 18:00'),
        },
        {
          id: 6,
          title: '学习Go',
          priority: 'low',
          deadline: new Date('2025-03-23 18:00'),
          isCompleted: false,
          updatedAt: new Date('2025-02-23 18:00'),
        },
      ])
    })
  })

// 添加待办
export const apiAddTodo = async (todoItem: TodoItem): Promise<TodoItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(todoItem)
    })
  })

// 更新待办
export const apiUpdateTodo = async (todoItem: TodoItem): Promise<TodoItem> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(todoItem)
    })
  })

// 删除待办
export const apiDeleteTodo = async (todoId: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    })
  })
