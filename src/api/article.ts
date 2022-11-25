import { apiInstance } from "./instance";

/**
 * 获取文章
 */
export function getArticleList(params: any) {
  return apiInstance({
    url: "/article",
    params,
  });
}

/**
 * 搜索
 */
export function articleSearch(data: any) {
  return apiInstance({
    url: "/article/search",
    method: "post",
    data,
  });
}

/**
 * 根据 id 获取
 * @param id id
 */
export function getArticleById(id: string) {
  return apiInstance({
    url: `/article/${id}`,
  });
}

/**
 * 新建
 * @param data
 */
export function createArticle(data: any) {
  return apiInstance({
    url: "/article",
    method: "post",
    data,
  });
}

/**
 * 更新
 */
export function updateArticle(id: string, data: any) {
  return apiInstance({
    url: `/article/${id}`,
    method: "put",
    data,
  });
}

/**
 * 删除
 */
export function deleteArticle(id: string) {
  return apiInstance({
    url: `/article/${id}`,
    method: "delete",
  });
}
