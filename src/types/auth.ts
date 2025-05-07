import type { ResponseData } from '@/types/response.ts'

// 登录表单
export interface LoginForm {
  username: string
  password: string
}

// 登录成功后后端返回的数据类型
export interface LoginDataType {
  token: string
  username: string
}

// 注册表单
export interface RegisterForm {
  username: string // 用户名 (4-20位字母,数字,下划线 /^[a-zA-Z0-9_]{4,20}$/)
  password: string // 密码 (6-20位字母,数字,至少包含一个字母和一个数字 /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
  phoneNumber: string // 手机号 (11位数字 /^1[3-9]\d{9}$/)
  confirmCode: string // 验证码  (六位数字 /^\d{6}$/ )
}

// 注册成功后后端返回的数据类型
export interface RegisterResponseData extends ResponseData {
  token: string
  id: number
  username: string
}
