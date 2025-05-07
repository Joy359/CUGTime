import type { LoginDataType, LoginForm } from '@/types/auth.ts'
import request from '@/utils/request.ts'

export const login = async (loginForm: LoginForm):Promise<LoginDataType> =>
  // 发送登录请求，响应拦截器会自动处理通用逻辑
   await request.post('auth/login', loginForm).then((res) => res.data)

