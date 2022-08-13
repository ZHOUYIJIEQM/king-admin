import { apiInstance } from "./instance";

interface queryType {
  pageNum?: number;
  pageSize?: number;
  // 升/降序
  orderType?: string;
  // 根据哪一项排序
  sortItem?: string;
}

const HeroApi = {
  /**
   * 获取英雄详情
   */
  getHeroList(params: queryType) {
    return apiInstance({
      url: "/hero",
      params,
    });
  },
  /**
   * 搜索
   */
  heroSearch(data: any) {
    return apiInstance({
      url: "/hero/search",
      method: "post",
      data
    })
  },
  /**
   * 创建英雄
   */
  createHero(data: any) {
    return apiInstance({
      url: "/hero",
      method: "post",
      data,
    });
  },
  /**
   * 根据 id 获取英雄信息
   * @param id id
   */
  getHeroById(id: string) {
    return apiInstance({
      url: `/hero/${id}`,
    });
  },
  /**
   * 更新信息
   */
  updateHero(id: string, data: any) {
    return apiInstance({
      url: `/hero/${id}`,
      method: "put",
      data,
    });
  },
  /**
   * 删除英雄
   */
  deleteHero(id: string) {
    return apiInstance({
      url: `/hero/${id}`,
      method: "delete",
    });
  },
  /**
   * 获取铭文
   */
  getInscription() {
    return apiInstance({
      url: '/inscription'
    })
  },
  /**
   * 获取召唤师技能
   */
  getSummoner() {
    return apiInstance({
      url: '/summoner'
    })
  }
};

export default HeroApi;
