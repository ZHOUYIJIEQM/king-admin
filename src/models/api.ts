/**
 * 登录接口参数类型
 */
export interface loginParams {
  username: string,
  password: string
}

/**
 * 分类
 */
export interface cateType {
  name: string,
  _id?: string,
  desc?: string,
  parent?: string | null,
}