import { apiInstance } from "./instance";

const ArticleApi = {
  getArticleList() {
    return apiInstance({
      url: '/article'
    })
  },
}

export default ArticleApi