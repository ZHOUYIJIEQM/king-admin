import { apiInstance } from "./instance";
import type { tableQueryType } from "@/models/api";

/**
 * 获取英雄详情
 */
export function getHeroList(params?: tableQueryType) {
  return apiInstance({
    url: "/hero",
    params,
  });
}

/**
 * 搜索
 */
export function heroSearch(data: any) {
  return apiInstance({
    url: "/hero/search",
    method: "post",
    data,
  });
}

/**
 * 创建英雄
 */
export function createHero(data: any) {
  return apiInstance({
    url: "/hero",
    method: "post",
    data,
  });
}

/**
 * 根据 id 获取英雄信息
 * @param id id
 */
export function getHeroById(id?: string) {
  return apiInstance({
    url: `/hero/${id}`,
  });
}

/**
 * 更新信息
 */
export function updateHero(id: string, data: any) {
  return apiInstance({
    url: `/hero/${id}`,
    method: "put",
    data,
  });
}

/**
 * 删除英雄
 */
export function deleteHero(id: string) {
  return apiInstance({
    url: `/hero/${id}`,
    method: "delete",
  });
}

/**
 * 获取铭文
 */
export function getInscription() {
  return apiInstance({
    url: "/inscription",
  });
}

/**
 * 获取召唤师技能
 */
export function getSummoner() {
  return apiInstance({
    url: "/summoner",
  });
}
