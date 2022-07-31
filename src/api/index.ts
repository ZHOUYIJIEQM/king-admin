import CateApi from './category'
import GoodsApi from './goods'
import HeroApi from './hero'
import ArticleApi from './article'
import AdApi from './ad'
import UserApiApi from './adminUser'
import LoginApi from './login'

export default {
  install(app: any) {
    app.config.globalProperties.$CateApi = CateApi
    app.config.globalProperties.$GoodsApi = GoodsApi
    app.config.globalProperties.$HeroApi = HeroApi
    app.config.globalProperties.$ArticleApi = ArticleApi
    app.config.globalProperties.$AdApi = AdApi
    app.config.globalProperties.$UserApiApi = UserApiApi
    app.config.globalProperties.$LoginApi = LoginApi
  }
}