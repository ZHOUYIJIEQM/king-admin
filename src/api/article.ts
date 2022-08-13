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
}

export default ArticleApi