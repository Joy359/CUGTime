import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('User', () => {
  // 用户信息
  const userInfo = ref<UserInfo>(<UserInfo>{
    username: localStorage.getItem('username'),
    password: '',
    token: '',
    avatar: '',
  })
  // 登录时间 自动计算 用于欢迎用户 比如上午好 下午好
  const loginTime = ref<Date>(new Date())
  return {
    userInfo,
    loginTime,
  }
})
