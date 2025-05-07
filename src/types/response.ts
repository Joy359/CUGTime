// 后端返回数据的一般类型
export interface ResponseData {
  code: 200 | 201 | 400 | 401 | 404 | 500
  message: string
  data?: object
}
