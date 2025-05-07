// 对axios进行二次封装: 使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础路径
  timeout: 5000, // 超时时间 5s
})
// 请求拦截器
request.interceptors.request.use((config) => {
  // config配置对象，headers属性请求头，经常给服务器携带公共参数
  // 返回配置对象
  // 给服务器携带token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 统一处理响应失败的情况
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message: string
    if (!error.response) {
      if (error.message.includes('timeout')) {
        message = '请求超时，请稍后再试'
      } else if (error.message.includes('Network Error')) {
        message = '连接服务器失败，请稍后再试'
      } else {
        message = '未知错误，请稍后再试'
      }
    } else {
      const status = error.response.status
      switch (status) {
        case 400:
          message = error.response.data.message
          break
        case 401:
          message = 'token过期'
          break
        case 403:
          message = '无权访问'
          break
        case 404:
          message = '请求地址错误'
          break
        case 500:
          message = '服务器出现问题'
          break
        default:
          message = '网络出现问题'
          break
      }
    }
    ElMessage({ type: 'error', message })
    // 返回拒绝的Promise，确保错误能被调用方的.catch捕获
    return Promise.reject(error)
  },
)
export default request
