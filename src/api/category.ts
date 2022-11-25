import { apiInstance } from "./instance";
import type { cateType } from "../models/api";

/**
 * 获取所有分类列表
 */
export function getCategoryList() {
  return apiInstance({
    url: "/category",
  });
}

/**
 * 根据分类 id 获取分类数据
 * @param id 分类 id
 */
export function getCateById(id: string) {
  return apiInstance({
    url: `/category/${id}`,
  });
}

/**
 * 新建分类
 * @param data
 */
export function createCate(data: cateType) {
  return apiInstance({
    url: "/category",
    method: "post",
    data,
  });
}

/**
 * 根据分类 id 更新数据
 * @param id 分类id
 */
export function updateCate(id: string, data: cateType) {
  return apiInstance({
    url: `/category/${id}`,
    method: "put",
    data,
  });
}

/**
 * 根据分类 id 删除
 * @param id 分类id
 */
export function deleteCate(id: string) {
  return apiInstance({
    url: `/category/${id}`,
    method: "delete",
  });
}

/**
 * 通过名称搜索
 * @param data
 */
export function searchCate(data: any) {
  return apiInstance({
    url: "/category/search",
    method: "post",
    data,
  });
}
