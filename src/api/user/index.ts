// API 接口统一管理
import request from '@/utils/request.ts'
import type { loginForm, loginResponseData, userResponseData } from '@/types/user'
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}

// 暴露请求函数
// 登录接口方法
export const reqLogin = (data: loginForm) => request.post<never, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息接口方法
export const reqUserInfo = () => request.get<userResponseData>(API.USERINFO_URL)
