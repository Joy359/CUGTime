// 对axios进行二次封装: 使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径，发请求的时候，路径当中会出现api
  timeout: 5000, // 超时时间 5s
})

// 请求拦截器
axios.interceptors.request.use(
  (config) =>
    // config配置对象，header属性请求头，经常给服务器携带公共参数
    // 返回配置对象
    config,
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 响应失败的回调函数 处理http网络错误
    let message: string
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
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
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)
export default request
