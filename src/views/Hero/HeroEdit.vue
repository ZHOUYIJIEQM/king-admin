<template>
  <div class="edit-page">
    <el-card v-if="typeof(heroData.name) === 'string'">
      <el-tabs v-model="activeName" @tab-change="tabChange">
        <el-tab-pane label="基本信息" name="info">
          <el-form class="info-box">
            <el-form-item label="英雄名称:">
              <el-input clearable class="short-bar" v-model="heroData.name" placeholder="请输入英雄名称!" />
            </el-form-item>
            <el-form-item label="英雄称号:">
              <el-input clearable class="short-bar" v-model="heroData.nickname" placeholder="请输入英雄称号!" />
            </el-form-item>
            <el-form-item label="英雄定位:">
              <el-select
                class="short-bar"
                v-model="heroData.category"
                multiple
                clearable
                placeholder="选择分类"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="英雄评级:" class="rate-box">
              <el-rate show-score :score-template="`攻击: ${heroData.scores.attack}`" :max="10" v-model="heroData.scores.attack" />
              <el-rate show-score :score-template="`难度: ${heroData.scores.difficulty}`" :max="10" v-model="heroData.scores.difficulty" />
              <el-rate show-score :score-template="`技能: ${heroData.scores.skill}`" :max="10" v-model="heroData.scores.skill" />
              <el-rate show-score :score-template="`生存: ${heroData.scores.survive}`" :max="10" v-model="heroData.scores.survive" />
            </el-form-item>
            <el-form-item label="英雄头像:">
              <UploadFile
                width="120px"
                height="120px"
                :actionUrl="actionUrl"
                :imageUrl="heroData.avatar"
                @uploadSuccess="uploadSuccess($event, heroData, 'avatar')"
              ></UploadFile>
            </el-form-item>
            <el-form-item label="英雄背景:">
              <UploadFile
                width="350px"
                :actionUrl="actionUrl"
                :imageUrl="heroData.backgroundImg"
                @uploadSuccess="uploadSuccess($event, heroData, 'backgroundImg')"
              ></UploadFile>
            </el-form-item>
            <el-form-item label="图文介绍:">
              <UploadFile
                width="350px"
                :actionUrl="actionUrl"
                :imageUrl="heroData.photo"
                @uploadSuccess="uploadSuccess($event, heroData, 'photo')"
              ></UploadFile>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="技能介绍" name="skills">
          <CardItem 
            class="skills-item"
            v-for="(item, index) in heroData.skills"
            :key="item._id || index"
            :title="`技能${index+1}`"
            @closeItem="heroData.skills.splice(index, 1)"
          >
            <el-form>
              <el-form-item label="技能名称:">
                <el-input clearable v-model="item.name" placeholder="请输入技能名称!" />
              </el-form-item>
              <el-form-item label="技能图标:">
                <UploadFile
                  width="80px"
                  height="80px"
                  :actionUrl="actionUrl"
                  :imageUrl="item.icon"
                  @uploadSuccess="uploadSuccess($event, heroData.skills[index], 'icon')"
                ></UploadFile>
              </el-form-item>
              <el-form-item label="技能冷却:">
                <el-input clearable v-model="item.delay" placeholder="请输入技能冷却!" />
              </el-form-item>
              <el-form-item label="技能详情:">
                <el-input :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" clearable v-model="item.desc" placeholder="请输入技能详情!" />
              </el-form-item>
              <el-form-item label="技能用法:">
                <el-input :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" clearable v-model="item.tips" placeholder="请输入技能用法!" />
              </el-form-item>
            </el-form>
          </CardItem>
          <btnAdd text="添加技能" fontSize="18px" @addCb="addSkills" />
        </el-tab-pane>
        <el-tab-pane label="英雄皮肤" name="skins">
          <div class="skins-box">
            <CardItem 
              class="skins-item" 
              v-for="(item, index) in heroData.skins" 
              :key="item._id"
              :title="`皮肤${index+1}`"
              @closeItem="deleteSkins(index)"
            >
              <el-form>
                <el-form-item label="名称:">
                  <el-input clearable class="skins-name" v-model="item.name" placeholder="请输入英雄称号!" />
                </el-form-item>
                <el-form-item class="skin" label="皮肤:">
                  <UploadFile
                    class="skins-avatar"
                    width="100%"
                    height="100%"
                    :actionUrl="actionUrl"
                    :imageUrl="item.img"
                    @uploadSuccess="uploadSuccess($event, heroData.skins[index], 'img')"
                  ></UploadFile>
                </el-form-item>
              </el-form>
            </CardItem>
            <btnAdd class="skins-item add-skins" text="添加皮肤" fontSize="18px" @addCb="addSkin" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="出装推荐" name="recommend">
          <el-form class="recommend-box" label-width="88px" label-position="top">
            <el-form-item label="顺风出装:">
              <el-select-v2
                style="min-width: 300px;"
                v-model="heroData.equipment.downWind"
                :options="goodsList"
                placeholder="请选择顺风装备!"
                :multiple-limit="6"
                multiple
                clearable
              />
            </el-form-item>
            <el-form-item label="逆风出装:">
              <el-select-v2
                style="min-width: 300px;"
                v-model="heroData.equipment.upWind"
                :options="goodsList"
                placeholder="请选择逆风装备!"
                :multiple-limit="6"
                multiple
                clearable
              />
            </el-form-item>
            <el-form-item label="铭文推荐:">
              <el-select-v2
                style="min-width: 300px;"
                v-model="heroData.inscriptionId"
                :options="inscriptionList"
                placeholder="选择铭文!"
                :multiple-limit="3"
                multiple
                clearable
              />
            </el-form-item>
            <el-form-item label="召唤师技能:">
              <el-select-v2
                style="min-width: 300px;"
                v-model="heroData.summonersId"
                :options="summonerSkillList"
                placeholder="选择召唤师技能!"
                multiple
                :multiple-limit="2"
                clearable
              />
            </el-form-item>
            <el-form-item label="推荐升级的技能:">
              <el-select-v2
                style="min-width: 300px;"
                v-model="heroData.levelUp"
                :options="heroSkilllevelUp"
                placeholder="推荐技能!"
                multiple
                :multiple-limit="2"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="使用技巧" name="tips">
          <CardItem 
            v-for="(item, index) in heroData.tips"
            :key="index"
            :title="`使用技巧${index+1}`"
            @closeItem="heroData.tips.splice(index, 1)"
          >
            <el-form>
              <el-form-item label="技巧名称:">
                <el-input clearable v-model="item.title" placeholder="请输入技巧名称!" />
              </el-form-item>
              <el-form-item label="技巧内容:">
                <el-input :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" v-model="item.content" placeholder="请输入技巧内容!" />
              </el-form-item>
            </el-form>
          </CardItem>
          <btnAdd text="添加技巧" fontSize="18px" @addCb="addTips" />
        </el-tab-pane>
        <el-tab-pane label="英雄关系" name="relations">
          <el-collapse class="relations-box" v-model="relationsName">
            <el-collapse-item 
              v-for="(item, index) in heroData.relations"
              :title="item.title" 
              :name="String(index+1)"
            >
              <CardItem
                v-for="(item1, index1) in item.relation"
                :title="`${item.title}${index1+1}`"
                @closeItem="item.relation.splice(index1, 1)"
              >
                <el-form-item label="选择英雄:">
                  <el-select-v2
                    v-model="item1.hero"
                    :options="heroList"
                    placeholder="选择英雄!"
                  />
                </el-form-item>
                <el-form-item label="关系内容:">
                  <el-input :autosize="{ minRows: 3, maxRows: 4 }" type="textarea" v-model="item1.content" placeholder="请输入技巧内容!" />
                </el-form-item>
              </CardItem>
              <btnAdd class="skins-item add-skins" text="添加" :iconSize="22" fontSize="14px" @addCb="addrelation(item.relation)" />
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
      <div class="bottom" v-permission="['admin']">
        <el-button class="save" type="primary" plain @click="saveHeroData">{{$t(`btn.save`)}}</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default { name: 'HeroEditExclude' }
</script>
<script lang="ts" setup>
import loading from '@/utils/loading'
import { commonStore } from "@/store/index"
import { getHeroById, updateHero, getHeroList, createHero } from "@/api/hero"
import { getInscription } from '@/api/inscription'
import { getSummoner } from '@/api/summoner'
import { getGoodsList } from '@/api/goods'

const route = useRoute()
const router = useRouter()
const { proxy: { $lodash } }: any = getCurrentInstance()
// 上传接口
const actionUrl = `${commonStore().uploadPath}/heros`
// 英雄数据
const heroData = ref<any>({})
// 分类列表
const categoryList = ref<any[]>([])
// 铭文列表
const inscriptionList = ref<any[]>([])
// 召唤师技能列表
const summonerSkillList = ref<any[]>([])
// 商品列表
const goodsList = ref<any[]>([])
// 英雄列表
const heroList = ref<any[]>([])
// 推荐升级的英雄技能
const heroSkilllevelUp = ref<any[]>([])
// 选中的标签页
const activeName = ref<string>('info')
// 英雄关系折叠
const relationsName = ref<string[]>([])

// activeName 改变时触发
const tabChange = async (name) => {
  if (name === 'recommend') {
    // 以获取到数据后, 不用再重新获取
    if (!inscriptionList.value.length && !summonerSkillList.value.length && !goodsList.value.length) {
      loading.openLoading()
      // 获取铭文
      let res = await getInscription()
      inscriptionList.value = res.data.map(i => ({value: i._id, label: i.name, desc: i.desc}))
      // 获取召唤师技能
      res = await getSummoner()
      summonerSkillList.value = res.data.map(i => ({value: i._id, label: i.name, description: i.description}))
      // 获取商品
      res = await getGoodsList()
      goodsList.value = res.data.map(i => ({value: i._id, label: i.name, desc: i.desc, passive: i.passive}))
      loading.closeLoading()
    }

    // 英雄技能升级推荐
    heroData.value.skills.forEach((i, idx) => {
      heroData.value.skills[idx].id = String(idx)
    })
    heroSkilllevelUp.value = heroData.value.skills.filter(i => i.name.trim())
      .map((i, index) => ({ value: i.id || index, label: i.name }))
  }

  if (name === 'relations' && !heroList.value.length) {
    loading.openLoading()
    let res = await getHeroList()
    heroList.value = res.data.map((i: any) => ({value: i._id, label: i.name}))
    loading.closeLoading()
  }
}
/**
 * 上传成功后改图片地址
 * 修改原对象的某个键的值
 * @param val 结果值
 * @param data 原来的对象
 * @param key 对象的可以
 */
const uploadSuccess = (val: string, data: any, key: string) => {
  key && (data[key] = val)
}
// 添加一个技能
const addSkills = () => {
  heroData.value.skills.push({
    delay: "",
    desc: "",
    icon: "",
    name: "",
    tips: "",
  })
}
// 保存
const saveHeroData = async () => {
  try {
    loading.openLoading()
    if (route.path.includes('edit')) {
      let res = await updateHero(route.params.id as string, heroData.value)
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: res.data.message
      })
    } else {
      // todo:
      let res = await createHero(heroData.value)
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: res.data.message
      })
    }
    loading.closeLoading()
    router.push({name: 'heroList', query: { reload: 'true' }})
  } catch (error) {
    console.log(error);
  } finally {
    loading.closeLoading()
  }
}
// 删除某个皮肤
const deleteSkins = (index: number) => {
  heroData.value.skins.splice(index, 1)
}
// 添加皮肤
const addSkin = () => {
  heroData.value.skins.push({
    name: '',
    img: '',
  })
}
// 添加关系
const addrelation = (val: any) => {
  val.push({})
}
// 添加技巧
const addTips = async () => {
  heroData.value.tips.push({
    title: "",
    content: "",
  })
}
// 编辑英雄, 获取英雄数据
const setHeroData = async () => {
  // 获取需要的英雄数据
  if (route.path.includes('edit')) {
    let res = await getHeroById(route.params.id as string)
    heroData.value = res.data.data
    categoryList.value = res.data.category
  } else {
    let res = await getHeroById()
    heroData.value = {
      name: "",
      nickname: "",
      ename: "",
      avatar: "",
      backgroundImg: "",
      photo: "",
      category: [],
      skins: [{
        img: "",
        name: "",
      }],
      scores: {
        difficulty: 0,
        skill: 0,
        attack: 0,
        survive: 0,
      },
      equipment: {
        downWind: [],
        upWind: [],
      },
      skills: [{
        name: "",
        id: "",
        icon: "",
        delay: "",
        desc: "",
        tips: "",
      }],
      levelUp: [],
      inscriptionId: [],
      summonersId: [],
      tips: [{
        title: "",
        content: "",
      }],
      relations: [{
        title: "最佳搭档",
        relation: [{
          content: "",
        }]
      },
      {
        title: "被谁克制",
        relation: [{
          content: "",
        }]
      },
      {
        title: "克制谁",
        relation: [{
          content: "",
        }]
      }],
    }
    categoryList.value = res.data.category
  }
}
// 初始化数据
const initData = async () => {
  try {
    loading.openLoading()
    // 获取英雄信息
    await setHeroData()
  } catch (error) {
    console.log(error);
  } finally {
    loading.closeLoading()
  }
}

const handleKeyDown = (e: any) => {
  if ((e.key as string).toLowerCase() === 'enter') {
    ElMessageBox.confirm( '确定要保存吗?', '保存',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await saveHeroData()
    })
    .catch(() => {})
  }
}
const debounceKeyDown = $lodash.debounce(handleKeyDown, 1000, { 'leading': true, 'trailing': false })

onMounted(async () => {
  await initData()
  // 回车保存
  window.addEventListener('keydown', debounceKeyDown)
})

onBeforeUnmount(async () => {
  window.removeEventListener('keydown', debounceKeyDown)
})

</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__body {
    padding: 10px 20px 20px;
  }
}
:deep(.el-tabs) {
  .short-bar {
    width: 60%;
    max-width: 500px;
  }
  .info-box {
    .rate-box {
      .el-form-item__content {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .el-rate__text {
      color: grey;
      font-size: 12px;
      margin-left: 10px;
    }
  }

  .skins-box {
    display: flex;
    flex-wrap: wrap;
    .skins-item {
      box-sizing: border-box;
      &.add-skins {
        height: auto !important;
        min-height: 200px;
      }
      &.card-item-comp {
        display: flex;
        flex-direction: column;
        .top {
          flex-shrink: 0;
        }
        .center {
          flex: 1;
          .el-form {
            height: 100%;
            display: flex;
            flex-direction: column;
            .skin {
              flex: 1;
              .upload-file-comp {
                height: 100%;
              }
            }
          }
        }
      }
    }
    .avatar-uploader {
      // min-height: 250px;
    }
    // 大于 1200px
    @media screen and (min-width: 1200px) {
      .skins-item {
        width: 32.3% !important;
        margin-right: 1.5%;
        margin-bottom: 1.5%;
        &:nth-child(3n+3) {
          margin-right: 0;
        }
      }
      .avatar-uploader {
        min-height: 300px;
      }
    }
    @media screen and (min-width: 800px) and (max-width: 1200px) {
      .skins-item {
        width: 49.25% !important;
        height: auto !important;
        margin-right: 1.5%;
        margin-bottom: 1.5%;
        &:nth-child(2n+2) {
          margin-right: 0;
        }
      }
      .avatar-uploader {
        min-height: 250px;
      }
    }
    @media screen and (max-width: 800px) {
      .skins-item {
        width: 100%;
      }
    }
  }
  .info-box, .recommend-box, .card-item-comp {
    .el-form-item__label {
      font-weight: bold;
    }
  }
  .relations-box {
    .el-collapse-item__header {
      font-size: 16px;
      font-weight: bold;
    }
    .title {
      font-size: 15px;
    }
  }
  
}
.bottom {
  display: flex;
  margin-top: 15px;
  .save {
    margin-left: auto;
    width: 120px;
    padding: 16px;
  }
}
</style>