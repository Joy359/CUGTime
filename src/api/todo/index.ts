import type { LoadTodoDataType, TodoForm, TodoItem } from '@/types/todo'
import request from '@/utils/request.ts'

// 模拟API接口
// 从服务器加载TodoList
export const apiFetchTodoList = async (): Promise<LoadTodoDataType> =>{
  const response = await request(`todos`)
  return response.data
}

// 添加待办
export const apiAddTodo = async (todoForm: TodoForm): Promise<TodoItem> =>
  await request.post('todos',todoForm).then((res) => res.data)

// 更新待办
export const apiUpdateTodo = async (todoId: number, todoForm: TodoForm): Promise<TodoItem> =>
  await request.put(`todos/${todoId}`, todoForm).then((res) => res.data)

// 删除待办
export const apiDeleteTodo = async (todoId: number): Promise<number> =>
  await request.delete(`todos/${todoId}`).then((res) => res.data)
