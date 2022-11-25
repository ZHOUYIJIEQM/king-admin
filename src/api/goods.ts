import { apiInstance } from "./instance";
import type { tableQueryType } from "@/models/api"

/**
 * 获取物品
 */
export function getGoodsList(params?: tableQueryType) {
  return apiInstance({
    url: "/items",
    params,
  });
}

/**
 * 新建物品
 */
export function createGoods(data: any) {
  return apiInstance({
    url: "/items",
    method: "post",
    data,
  });
}

/**
 * 根据 id 获取商品
 * @param id 物品id
 */
export function getGoodsById(id: string) {
  return apiInstance({
    url: `/items/${id}`,
  });
}

/**
 * 更新商品信息
 */
export function updateGoods(id: string, data: any) {
  return apiInstance({
    url: `/items/${id}`,
    method: "put",
    data,
  });
}

/**
 * 删除商品
 */
export function deleteGoods(id: string) {
  return apiInstance({
    url: `/items/${id}`,
    method: "delete",
  });
}

/**
 * 通过名称搜索
 * @param data
 */
export function getGoodsByName(data: any) {
  return apiInstance({
    url: "/items/search",
    method: "post",
    data,
  });
}
