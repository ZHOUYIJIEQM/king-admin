import { apiInstance } from "./instance";

const AdApi = {
  /**
   * 获取广告轮播
   */
  getAd(params: any) {
    return apiInstance({
      url: "/ad",
      params
    })
  },
  /**
   * 新建轮播
   */
  createAd(data: any) {
    return apiInstance({
      url: "/ad",
      method: "post",
      data,
    });
  },
  /**
   * 更新信息
   */
  updateAd(id: string, data: any) {
    return apiInstance({
      url: `/ad/${id}`,
      method: 'put',
      data
    })
  },
  /**
   * 删除
   */
  deleteAd(id: string) {
    return apiInstance({
      url: `/ad/${id}`,
      method: 'delete'
    })
  },
}

export default AdApi