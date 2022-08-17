<template>
  <div class="hero-edit-page">
    <el-card v-if="initEnd">
      <el-form>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="info">
            <div class="pane-innerbox info-box">
              <el-form-item label="英雄名称">
                <el-input clearable class="short-input" v-model="heroData.data.name" placeholder="请输入英雄名称!"></el-input>
              </el-form-item>
              <el-form-item label="英雄称号">
                <el-input clearable class="short-input" v-model="heroData.data.nickname" placeholder="请输入英雄称号!"></el-input>
              </el-form-item>
              <el-form-item label="英雄定位">
                <el-select
                  v-model="heroData.data.cate"
                  multiple
                  placeholder="选择分类"
                >
                  <el-option
                    v-for="item in heroCate"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="英雄评级">
                <div>
                  <el-rate
                    show-score
                    :score-template="'攻击: '+heroData.data.scores.attack"
                    :max="10"
                    v-model="heroData.data.scores.attack" />
                    <br />
                    <el-rate
                      show-score
                      :score-template="'难度: '+heroData.data.scores.difficulty"
                      :max="10"
                      v-model="heroData.data.scores.difficulty" />
                    <br />
                    <el-rate 
                      show-score
                      :score-template="'技能: '+heroData.data.scores.skill"
                      :max="10"
                      v-model="heroData.data.scores.skill" />
                    <br />
                    <el-rate 
                      show-score
                      :score-template="'生存: '+heroData.data.scores.survive"
                      :max="10"
                      v-model="heroData.data.scores.survive" />
                </div>
              </el-form-item>
              <el-form-item label="英雄头像">
                <UploadFileVue
                  class="hero-avatar"
                  :actionUrl="actionUrl"
                  :imageUrl="heroData.data.avatar"
                  @uploadSuccess="uploadSuccess($event, heroData.data, 'avatar')"
                ></UploadFileVue>
              </el-form-item>
              <el-form-item label="英雄背景">
                <UploadFileVue
                  class="hero-banner"
                  :actionUrl="actionUrl"
                  :imageUrl="heroData.data.banner"
                  @uploadSuccess="uploadSuccess($event, heroData.data, 'banner')"
                ></UploadFileVue>
              </el-form-item>
              <el-form-item label="图文介绍">
                <UploadFileVue
                  class="hero-photo"
                  :actionUrl="actionUrl"
                  :imageUrl="heroData.data.photo"
                  @uploadSuccess="uploadSuccess($event, heroData.data, 'photo')"
                ></UploadFileVue>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="技能介绍" name="skills">
            <div class="pane-innerbox skills-box">
              <cardItemVue 
                v-for="(item, index) in heroData.data.skills"
                :key="item._id || index"
                :title="`技能${index+1}`"
                @close-item="heroData.data.skills.splice(index, 1)"
              >
                <el-form-item label="技能名称">
                  <el-input clearable v-model="item.name" placeholder="请输入技能名称!"></el-input>
                </el-form-item>
                <el-form-item label="技能图标">
                  <UploadFileVue
                    class="hero-avatar"
                    :actionUrl="actionUrl"
                    :imageUrl="item.icon"
                    @uploadSuccess="uploadSuccess($event, heroData.data.skills[index], 'icon')"
                  ></UploadFileVue>
                </el-form-item>
                <el-form-item label="技能冷却">
                  <el-input clearable v-model="item.delay" placeholder="请输入技能冷却!"></el-input>
                </el-form-item>
                <el-form-item label="技能详情">
                  <el-input :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" clearable v-model="item.desc" placeholder="请输入技能详情!"></el-input>
                </el-form-item>
                <el-form-item label="技能用法">
                  <el-input :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" clearable v-model="item.tips" placeholder="请输入技能用法!"></el-input>
                </el-form-item>
              </cardItemVue>
              <div class="card-item">
                <el-button class="button" text @click="addSkills">
                  <el-icon :size="25" class="plus"><Plus /></el-icon>
                  <div style="margin-left: 20px;">添加一个技能</div>
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="英雄皮肤" name="skins">
            <div class="pane-innerbox skins-box">
              <div class="skins">
                <cardItemVue 
                  class="skins-item" 
                  v-for="(item, index) in heroData.data.skins" 
                  :key="item._id"
                  :title="`皮肤${index+1}`"
                  @close-item="deleteSkins(index)"
                >
                  <el-form-item label="名称">
                    <el-input clearable class="skins-name" v-model="item.name" placeholder="请输入英雄称号!"></el-input>
                  </el-form-item>
                  <el-form-item label="皮肤">
                    <UploadFileVue
                      class="skins-avatar"
                      :actionUrl="actionUrl"
                      :imageUrl="item.img"
                      @uploadSuccess="uploadSuccess($event, heroData.data.skins[index], 'img')"
                    ></UploadFileVue>
                  </el-form-item>
                </cardItemVue>
                <div class="skins-item add-item">
                  <el-button class="button" text @click="addSkin">
                    <el-icon class="plus"><Plus /></el-icon>
                    <div style="margin-top: 10px;">添加皮肤</div>
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="出装推荐" name="equipment">
            <div class="pane-innerbox equipment-box">
              <div class="equ-item">
                <div class="title">顺风出装</div>
                <el-select
                  class="equipment-select"
                  v-model="heroData.data.downWind.equipment"
                  multiple
                  :multiple-limit="6"
                  placeholder="选择装备"
                >
                  <el-tooltip
                    v-for="(item, index) in goodsList"
                    :key="index"
                    placement="right"
                    effect="light"
                    :hide-after="0"
                  >
                    <template #content>
                      <div style="width: 300px">
                        <div 
                          class="desc-item"
                          v-for="(item1, index1) in item.desc"
                          :key="index1"
                        >{{item1}}</div>
                      </div>
                    </template>
                    <el-option
                      :label="item.name"
                      :value="item.itemId"
                    />
                  </el-tooltip>
                </el-select>
              </div>
              <div class="equ-item">
                <div class="title">逆风出装</div>
                <el-select
                  class="equipment-select"
                  v-model="heroData.data.upWind.equipment"
                  multiple
                  :multiple-limit="6"
                  placeholder="选择装备"
                >
                  <el-tooltip
                    v-for="(item, index) in goodsList"
                    :key="index"
                    placement="right"
                    effect="light"
                    :hide-after="0"
                  >
                    <template #content>
                      <div style="width: 300px">
                        <div 
                          class="desc-item"
                          v-for="(item1, index1) in item.desc"
                          :key="index1"
                        >{{item1}}</div>
                      </div>
                    </template>
                    <el-option
                      :label="item.name"
                      :value="item.itemId"
                    />
                  </el-tooltip>
                </el-select>
              </div>
              <div class="equ-item">
                <div class="title">铭文推荐</div>
                <el-select
                  class="equipment-select"
                  v-model="heroData.data.InscriptionId"
                  multiple
                  :multiple-limit="3"
                  placeholder="选择铭文"
                >
                  <el-tooltip
                    v-for="item in inscription"
                    :key="item._id"
                    placement="right"
                    effect="light"
                    :hide-after="0"
                  >
                    <template #content>
                      <div style="width: 100px">
                        <div v-for="(item1, index1) in item.desc" :key="index1">
                          {{item1}}
                        </div>
                      </div>
                    </template>
                    <el-option
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-tooltip>
                </el-select>
              </div>
              <div class="equ-item">
                <div class="title">召唤师技能</div>
                <el-select
                  class="equipment-select"
                  v-model="heroData.data.summonersId"
                  multiple
                  :multiple-limit="2"
                  placeholder="选择召唤师技能"
                >
                  <el-tooltip
                    v-for="item in summoner"
                    :key="item._id"
                    :content="item.description"
                    placement="right"
                    effect="light"
                    :hide-after="0"
                  >
                    <template #content>
                      <div style="width: 300px">{{item.description}}</div>
                    </template>
                    <el-option
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-tooltip>
                </el-select>
              </div>
              <div class="equ-item">
                <div class="title">技能升级推荐</div>
                <el-select
                  class="equipment-select"
                  placeholder="选择升级推荐"
                  multiple
                  :multiple-limit="2"
                  v-model="levelUp"
                  @change="levelUpChange"
                >
                  <el-tooltip
                    v-for="(item, index) in heroData.data.skills"
                    :key="index"
                    placement="right"
                    effect="light"
                    :hide-after="0"
                  >
                    <template #content>
                      <div style="width: 300px">{{item.desc}}</div>
                    </template>
                    <el-option
                      :label="item.name"
                      :value="item.id"
                    />
                    </el-tooltip>
                </el-select>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="使用技巧" name="tips">
            <div class="pane-innerbox tip-box">
              <cardItemVue 
                v-for="(item, index) in heroData.data.tips"
                :key="index"
                :title="`使用技巧${index+1}`"
                @close-item="heroData.data.tips.splice(index, 1)"
              >
                <el-form-item label="技巧名称">
                  <el-input clearable v-model="item.title" placeholder="请输入技巧名称, 方便参考哦!"></el-input>
                </el-form-item>
                <el-form-item label="技巧内容">
                  <el-input :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" v-model="item.content" placeholder="请输入技巧内容, 方便参考哦!"></el-input>
                </el-form-item>
              </cardItemVue>
              <div class="card-item">
                <el-button class="button" text @click="addTips">
                  <el-icon :size="25" class="plus"><Plus /></el-icon>
                  <div style="margin-left: 20px;">添加一个技巧</div>
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="英雄关系" name="relations">
            <div class="pane-innerbox relations-box">
              <el-collapse
              >
              <!-- v-model="relationActive" -->
                <el-collapse-item 
                  v-for="(item, index) in heroData.data.relations"
                  :title="item.title" 
                  :name="String(index+1)"
                >
                  <cardItemVue
                    v-for="(item1, index1) in item.hero"
                    :title="`${item.title}${index1+1}`"
                    @close-item="item.hero.splice(index1, 1)"
                  >
                    <el-form-item label="选择英雄">
                      <el-select
                        v-model="item1.ename"
                        placeholder="选择英雄!"
                      >
                        <el-option
                          v-for="(item2, index2) in allHero"
                          :key="index2"
                          :label="item2.name"
                          :value="item2.ename"
                          @click="selectOption(item1, item2)"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="关系内容">
                      <el-input :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" v-model="item1.content" placeholder="请输入技巧内容, 方便参考哦!"></el-input>
                    </el-form-item>
                  </cardItemVue>
                  <div class="card-item">
                    <el-button class="button" text @click="addRelations(item)">
                      <el-icon :size="25" class="plus"><Plus /></el-icon>
                      <div style="margin-left: 20px;">添加关系 {{item.title}}</div>
                    </el-button>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="bottom">
          <el-button class="save" type="primary" plain @click="saveHeroData">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import loading from '@/utils/loading'
import { Plus } from '@element-plus/icons-vue'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import { ElNotification } from "element-plus";
import { useRoute, useRouter } from 'vue-router';
import UploadFileVue from '@/components/UploadFile.vue';
import cardItemVue from '@/components/CardItem.vue';
import { commonStore } from "@/store/index";

const $route = useRoute()
const $router = useRouter()
const app: any = getCurrentInstance()
const { getCategoryList } = app.proxy.$CateApi
const { getHeroList, createHero, getHeroById, updateHero, getInscription, getSummoner } = app?.proxy.$HeroApi
const { getGoodsList } = app?.proxy.$GoodsApi

// 上传接口
const actionUrl = `${commonStore().uploadPath}hero`
// 初始化数据
let initEnd = ref<boolean>(false)
// 标记编辑/新增
let editType = ref<string>('')
// 选中的标签页
let activeName = ref<string>('info')
// 英雄数据
let heroData = reactive({
  data: {} as any
})
// 英雄分类
let heroCate = ref<any[]>([])
let inscription = ref<any[]>([])
let goodsList = ref<any[]>([])
let summoner = ref<any[]>([])
let allHero = ref<any[]>([])
let levelUp = ref<any[]>([])

/**
 * 点击标签
 */
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.name);
  if (tab.props.name === 'equipment') {
    // if (heroData.data.skills[0].id.length && ) {
      heroData.data.skills = heroData.data.skills.map((i: any, index: number) => {
        // return Object.assign(i, {id: `skill${index+1}`})
        if (i.id.length && i.id.indexOf('skill') === -1) {
          return i
        } else {
          return Object.assign(i, {id: `skill${index+1}`})
        }
      })
    // }
    levelUp.value = heroData.data.levelUp.map((i: any) => i.id)
    console.log(heroData.data.skills);
  }
}

const levelUpChange = (val: any) => {
  heroData.data.levelUp = []
  val.forEach((i: any) => {
    let index = heroData.data.skills.findIndex((i2: any) => i2.id === i)
    if (index !== -1) {
      heroData.data.levelUp.push({
        "id": i,
        "icon": heroData.data.skills[index].icon,
      })
    }
  })
}

const selectOption = (val1: any, val2: any) => {
  // console.log(allHero.value);
  // console.log(val1, val2);
  val1.icon = val2.icon
  // console.log(JSON.stringify(heroData.data.relations[0], null, '  '));
}


/**
 * 添加关系
 */
const addRelations = (val: any) => {
  val.hero.push({
    ename: '',
    content: '',
    icon: ''
  })
}

/**
 * 获取英雄数据
 */
const getHeroData = async (id: string) => {
  let res = await getHeroById(id)
  heroData.data = res.data
  heroData.data.cate = res.data.cate.map((i: any) => i._id)
  console.log(heroData.data);
}

/**
 * 获取分类
 */
const getCate = async () => {
  let res = await getCategoryList()
  let index = res.data.findIndex((i: any) => i.name === "英雄列表")
  heroCate.value = res.data[index].children
}

/**
 * 上传成功后改图片地址
 */
const uploadSuccess = (val: string, data: any, key: string) => {
  if (key) {
    data[key] = val
  }
}

/**
 * 删除某个皮肤
 */
const deleteSkins = (index: number) => {
  heroData.data.skins.splice(index, 1)
}

/**
 * 添加皮肤
 */
const addSkin = () => {
  heroData.data.skins.push({
    name: '',
    img: '',
  })
}
const addTips = () => {
  heroData.data.tips.push({
    title: "",
    content: "",
  })
}
const addSkills = () => {
  heroData.data.skills.push({
    delay: "",
    desc: "",
    icon: "",
    name: "",
    tips: "",
  })
}

// 新建英雄数据初始化
const initHeroData = () => {
  heroData.data = {
    "name": "",
    "nickname": "",
    "avatar": "",
    "banner": "",
    "photo": "",
    "cate": [],
    "scores": {
      "difficulty": 0,
      "skill": 0,
      "attack": 0,
      "survive": 0
    },
    // 皮肤
    "skins": [
      {
        "img": "",
        "name": "",
      },
    ],
    // 技能
    "skills": [
      {
        "icon": "",
        "name": "",
        "delay": "",
        "desc": "",
        "tips": "",
      },
    ],
    "levelUp": [],
    // 铭文推荐
    "InscriptionId": [],
    "summonersId": [],
    // 顺风
    "downWind": {
      "equipment": []
    },
    // 逆风
    "upWind": {
      "equipment": []
    },
    // 技巧提示
    "tips": [
      {
        "title": "",
        "content": "",
      },
    ],
    // 英雄关系
    "relations": [
      {
        "title": "最佳搭档",
        "hero": [
          {
            "icon": "",
            "content": ""
          }
        ]
      },
      {
        "title": "被谁克制",
        "hero": [
          {
            "icon": "",
            "content": ""
          }
        ]
      },
      {
        "title": "克制谁",
        "hero": [
          {
            "icon": "",
            "content": ""
          }
        ]
      },
    ]
  }
}

/**
 * 保存
 */
const saveHeroData = async () => {
  console.log(heroData.data);
  loading.openLoading()
  if (editType.value === 'edit') {
    try {
      let res = await updateHero(heroData.data._id, heroData.data)
      if (res.status === 200) {
        ElNotification({
          title: 'Success',
          message: '数据更新成功!',
          type: 'success',
        })
        activeName.value = 'info'
        setTimeout(() => {
          let scrollBox: any = commonStore().elScrollEl
          scrollBox.wrap$.scrollTop = 0
        }, 250)
      }
    } catch (error) {
      console.log('数据更新失败', error);
      ElNotification({
        title: 'Error',
        message: '数据更新失败了!',
        type: 'error',
      })
    } finally {
      loading.closeLoading()
    }
  } else {
    // todo: 新增
    try {
      let res = await createHero(heroData.data)
      if (res.status === 200) {
        ElNotification({
          title: 'Success',
          message: '数据更新成功!',
          type: 'success',
        })
        $router.push({name: 'hero'})
      }
    } catch (error) {
      console.log('数据新增失败', error);
      ElNotification({
        title: 'Error',
        message: '数据新增失败了!',
        type: 'error',
      })
    } finally {
      loading.closeLoading()
    }
  }
}

/**
 * 初始化
 */
const initAll = async () => {
  loading.openLoading()
  try {
    await getCate()
    let res = await getGoodsList()
    goodsList.value = res.data.data.map((i: any) => {
      let desc = i.desc.concat(i.passive)
      return {
        name: i.name,
        _id: i._id,
        itemId: i.itemId,
        desc
      }
    })
    // console.log(goodsList.value);
    res = await getInscription()
    inscription.value = res.data.data
    // console.log('铭文', inscription.value);
    res = await getSummoner()
    summoner.value = res.data.data
    res = await getHeroList()
    res.data.data.forEach((i: any) => {
      // 排除掉当前的英雄
      if (i.ename !== heroData.data.ename) {
        allHero.value.push({
          name: i.name,
          ename: i.ename,
          icon: i.avatar
        })
      }
    })
    if ($route.params?.id) {
      editType.value = 'edit'
      // console.log('编辑英雄');
      await getHeroData($route.params.id as string)
      // console.log('所有英雄', allHero.value);
    } else {
      editType.value = 'create'
      initHeroData()
      // console.log('新建');
    }
    initEnd.value = true
  } catch (error) {
    console.log(error);
  } finally {
    loading.closeLoading()
    // setTimeout(() => {loading.closeLoading()}, 3000)
  }
}

onMounted(async () => {
  await initAll()
})
</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-rate__item {
    display: inline-flex;
    align-items: center;
    &+.el-rate__text {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .el-collapse-item__header {
    font-size: 16px;
    font-weight: bold;
  }
  .el-input__inner {
    text-overflow: ellipsis;
  }
  .info-box {
    .el-select {
      width: 330px;
    }
  }

  .hero-avatar {
    .el-upload {
      width: 100px;
      max-height: 100px;
    }
  }
  .hero-banner, .hero-photo {
    .el-upload {
      width: 60%;
    }
  }
  .skins-avatar {
    width: 100%;
    .el-upload {
      width: 100%;
      // width: 85%;
    }
  }
}

.skins-box {
  .skins {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .skins-item {
      $pd: 15px;
      box-sizing: border-box;
      border-radius: 6px;
      border: 2px solid var(--el-card-border-color);
      .center {
        padding: $pd 12px;
        .skins-name {
          // width: 85%;
        }
        .el-form-item:last-child {
          margin-bottom: 0;
        }
      }
      &.add-item {
        border-style: dashed;
        min-height: 200px;
        :deep(.el-button) {
          width: 100%;
          height: 100%;
          .plus {
            font-size: 50px;
          }
          &>span {
            flex-direction: column;
            color: #9b9b9b;
          }
        }
      }
    }
  }
}

.equipment-box {
  .equ-item {
    margin-bottom: 15px;
    .title {
      font-weight: bold;
    }
    .equipment-select {
      margin-top: 15px;
      width: 320px;
    }
  }
}

.pane-innerbox {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

.card-item {
  border: 2px solid var(--el-card-border-color);
  border-radius: 6px;
  margin-bottom: 15px;
  .button {
    width: 100%;
    padding: 50px 0;
    &>span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.desc-item {
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 1200px) {
  .skins-item {
    width: 24.5%;
    margin-right: 0.66%;
    margin-bottom: 0.66%;
    &:nth-child(4n+4) {
      margin-right: 0;
    }
  }
}
@media screen and (min-width: 900px) and (max-width: 1200px) {
  .skins-item {
    width: 32.6%;
    margin-right: 1%;
    margin-bottom: 1%;
    &:nth-child(3n+3) {
      margin-right: 0;
    }
  }
}
@media screen and (max-width: 900px) {
  .skins-item {
    width: 49%;
    margin-right: 2%;
    margin-bottom: 2%;
    &:nth-child(2n+2) {
      margin-right: 0;
    }
  }
}

.short-input {
  width: 400px;
}
.bottom {
  margin-top: 15px;
  display: flex;
  .save {
    margin-left: auto;
    width: 120px;
    padding: 16px;
  }
}

</style>