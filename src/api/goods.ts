import { apiInstance } from "./instance";

interface queryType {
  pageNum?: number,
  pageSize?: number,
  // 升/降序
  orderType?: string,
  // 根据哪一项排序
  sortItem?: string
}

const GoodsApi = {
  /**
   * 获取物品
   */
  getGoodsList(params: queryType) {
    return apiInstance({
      url: '/items',
      params
    })
  },
  /**
   * 新建物品
   */
  createGoods(data: any) {
    return apiInstance({
      url: '/items',
      method: 'post',
      data
    })
  },
  /**
   * 根据 id 获取商品
   * @param id 物品id
   */
  getGoodsById(id: string) {
    return apiInstance({
      url: `/items/${id}`
    })
  },
  /**
   * 更新商品信息
   */
  updateGoods(id: string, data: any) {
    return apiInstance({
      url: `/items/${id}`,
      method: 'put',
      data
    })
  },
  /**
   * 删除商品
   */
  deleteGoods(id: string) {
    return apiInstance({
      url: `/items/${id}`,
      method: 'delete'
    })
  },
}

export default GoodsApi