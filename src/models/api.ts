/**
 * 登录接口参数类型
 */
export interface loginParams {
  userName: string,
  passWord: string
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

// 表格请求参数
export interface tableQueryType {
  pageNum?: number
  pageSize?: number
  // 升/降序
  orderType?: string
  // 根据哪一项排序
  sortItem?: string
}