<template>
   
</template>
<script lang="ts">
export default {
  name: 'HeroEditExclude'
}
</script>

<script lang="ts" setup>
import loading from '@/utils/loading'
import { Plus } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { commonStore } from "@/store/index";

const $route = useRoute()
const $router = useRouter()
const app: any = getCurrentInstance()
const { getCategoryList } = app.proxy.$CateApi
const { getHeroList, createHero, getHeroById, updateHero, getInscription, getSummoner } = app?.proxy.$HeroApi
const { getGoodsList } = app?.proxy.$GoodsApi

// 上传接口
const actionUrl = `${commonStore().uploadPath}/hero`
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
let articleId = ref<string>('')
let activeNames = ref<string []>(['1', '2', '3'])

/**
 * 点击标签
 */
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  // console.log(tab.props.name);
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
    // console.log(heroData.data.skills);
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
  // console.log(heroData.data);
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
  // console.log(heroData.data);
  loading.openLoading()
  if (editType.value === 'edit') {
    try {
      let res = await updateHero(heroData.data._id, heroData.data)
      if (res.status === 200) {
        ElNotification({
          duration: commonStore().tipDurationS,
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
        duration: commonStore().tipDurationS,
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
          duration: commonStore().tipDurationS,
          title: 'Success',
          message: '数据更新成功!',
          type: 'success',
        })
        $router.push({name: 'hero'})
      }
    } catch (error) {
      console.log('数据新增失败', error);
      ElNotification({
        duration: commonStore().tipDurationS,
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
    // setTimeout(() => {loading.closeLoading()}, 3000)
  }
}

onMounted(async () => {
  loading.openLoading()
  await initAll()
  setTimeout(() => { loading.closeLoading() }, 300)
})

// onActivated(async () => {
//   loading.openLoading()
//   if (articleId.value !== $route.params.id) {
//     console.log('不一样', $route.params.id, articleId.value);
//     // initHeroData()
//     await initAll()
//   }
//   // await initAll()
//   setTimeout(() => { loading.closeLoading() }, 300)
// })


// onBeforeRouteLeave((to, from, next) => {
//   articleId.value = $route.params.id
//   next()
// })

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