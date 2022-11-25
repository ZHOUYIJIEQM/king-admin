import { apiInstance } from "./instance";

/**
 * 获取广告轮播
 */
export function getAd() {
  return apiInstance({
    url: "/ad",
  });
}

/**
 * 新建轮播
 */
export function createAd(data: any) {
  return apiInstance({
    url: "/ad",
    method: "post",
    data,
  });
}

/**
 * 更新信息
 */
export function updateAd(id: string, data: any) {
  return apiInstance({
    url: `/ad/${id}`,
    method: "put",
    data,
  });
}

/**
 * 删除
 */
export function deleteAd(id: string) {
  return apiInstance({
    url: `/ad/${id}`,
    method: "delete",
  });
}
