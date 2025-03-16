import { defineStore } from 'pinia'
// 引入路由
import { routes } from '@/router'
export const useUserStore = defineStore('User', () => {
  const menuRouters = routes

  return { menuRouters }
})
