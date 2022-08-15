import { apiInstance } from "./instance";

const AdApi = {
  /**
   * 获取广告轮播
   */
  getAd() {
    return apiInstance({
      url: "/ad"
    })
  },
  /**
   * 更新所有ad
   */
  updataAd(data: any) {
    return apiInstance({
      url: '/ad',
      method: 'post',
      data
    })
  }
}

export default AdApi