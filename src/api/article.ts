import { apiInstance } from "./instance";

const ArticleApi = {
  /**
   * 获取文章
   */
  getArticleList(params: any) {
    return apiInstance({
      url: '/article',
      params,
    })
  },
  /**
   * 搜索
   */
  articleSearch(data: any) {
    return apiInstance({
      url: "/article/search",
      method: "post",
      data
    })
  },
  /**
   * 根据 id 获取
   * @param id id
   */
  getArticleById(id: string) {
    return apiInstance({
      url: `/article/${id}`,
    });
  },
  /**
   * 新建
   * @param data 
   */
  createArticle(data: any) {
    return apiInstance({
      url: "/article",
      method: "post",
      data
    })
  },
  /**
   * 更新
   */
  updateArticle(id: string, data: any) {
    return apiInstance({
      url: `/article/${id}`,
      method: "put",
      data,
    })
  },
  /**
   * 删除
   */
  deleteArticle(id: string) {
    return apiInstance({
      url: `/article/${id}`,
      method: "delete",
    });
  },
}

export default ArticleApi