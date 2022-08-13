import { apiInstance } from "./instance";
import type { cateType } from "../models/api"

const CateApi = {
  /**
   * 获取所有分类列表
   */
  getCategoryList() {
    return apiInstance({
      url: '/category'
    })
  },
  /**
   * 根据分类 id 获取分类数据
   * @param id 分类 id
   */
  getCateById(id: string) {
    return apiInstance({
      url: `/category/${id}`
    })
  },
  /**
   * 新建分类
   * @param data 
   */
  createCate(data: cateType) {
    return apiInstance({
      url: '/category',
      method: 'post',
      data
    })
  },
  /**
   * 根据分类 id 更新数据
   * @param id 分类id
   */
  updateCate(id: string, data: cateType) {
    return apiInstance({
      url: `/category/${id}`,
      method: 'put',
      data
    })
  },
  /**
   * 根据分类 id 删除
   * @param id 分类id
   */
  deleteCate(id: string) {
    return apiInstance({
      url: `/category/${id}`,
      method: 'delete'
    })
  }

}

export default CateApi