import { apiInstance } from "./instance";

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
   * 根据id读取分类
   */
  getCateById(id: string) {
    console.log('根据id读取分类', id);
  }

}

export default CateApi