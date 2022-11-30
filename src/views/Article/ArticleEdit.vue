<template>
  <div class="edit-page">
    <el-card>
      <el-form label-position="top">
        <el-form-item label="文章标题:">
          <el-input clearable v-model="articleForm.name" placeholder="请输入文章标题!" />
        </el-form-item>
        <el-form-item label="文章分类:">
          <el-select
            class="cate-select"
            v-model="articleForm.category"
            multiple
            clearable
            placeholder="选择分类"
          >
            <el-option
              v-for="item in cateList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容:">
          <div class="editor-box">
            <TinyMceEditor 
              v-model:editorContent="articleForm.content" 
              :setting="tinymceSetting"
            />
          </div>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-button 
          v-permission="['admin']" 
          class="save-btn" 
          type="primary" 
          plain 
          @click="saveContent"
        >{{$t(`btn.save`)}}</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default { name: 'ArticleEditExclude' }
</script>
<script lang="ts" setup>
import { getCategoryList } from "@/api/category"
import { updateArticle, getArticleById, createArticle } from "@/api/article"
import loading from '@/utils/loading'
import { commonStore } from "@/store/index"

const route = useRoute()
const router = useRouter()
const { proxy: { $lodash } }: any = getCurrentInstance()

// 原始
const oFormData = {
  name: '',
  category: [],
  content: '',
  createdTime: 0
}
// 表单
const articleForm = ref<any>($lodash.cloneDeep(oFormData))
// 分类
const cateList = ref<any[]>([])
// 富文本编辑器设置
const tinymceSetting = {
  height: 400,
  toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
  plugins: 'codesample link image table lists fullscreen',
  toolbar_mode: 'sliding',
  nonbreaking_force_tab: true,
  link_title: false,
  default_link_target: '_blank',
  content_style: 'body{font-size: 16px}',
  placeholder: '请输入文章内容!',
  // 自定义 图片上传模式
  custom_images_upload: true,
  // 设置请求头
  custom_images_upload_header: commonStore().getToken,
  // 上传路径
  images_upload_url: `${commonStore().uploadPath}/articles`,
  // 上传图片回调
  custom_images_upload_callback: (res: any) => {
    // console.log(res.url);
    return res.url
  },
  // 以中文简体为例
  language: 'zh_CN',
};

// 设置分类
const setCateList = async () => {
  let res = await getCategoryList()
  // 只保留 "新闻资讯" "赛事中心"
  let index = res.data.findIndex((i: any) => i.name === "新闻资讯")
  cateList.value.push(res.data[index].children)
  index = res.data.findIndex((i: any) => i.name === "赛事中心")
  cateList.value.push(res.data[index].children)
  cateList.value = cateList.value.flat()
}
// 如果是编辑, 获取文章信息
const getArticle = async () => {
  try {
    if (route.params.id) {
      const res = await getArticleById((route.params.id as string))
      if (res.status === 200) {
        articleForm.value.category = res.data.category
        articleForm.value.name = res.data.name
        articleForm.value.content = res.data.content
      }
    }
  } catch (error) {
    console.log(error);
    ElNotification({
      duration: commonStore().tipDurationS,
      title: 'Error',
      message: '获取文章数据失败了!',
      type: 'error',
    })
  }
}
// 保存
const saveContent = async () => {
  if (!articleForm.value.category.length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请选择分类!'
    })
    return 
  }
  if (!articleForm.value.name.trim().length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请输入标题!'
    })
    return
  }
  if (!articleForm.value.content.trim().length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请输入文章内容!'
    })
    return
  }

  articleForm.value.createdTime = Date.now()
  if (route.params.id) {
    // 更新
    let res = await updateArticle((route.params?.id as string), articleForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: '更新成功!'
      })
    }
  } else {
    // 新增
    let res = await createArticle(articleForm.value)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: '文章添加成功!'
      })
    }
  }
  router.push({name: 'articleList', query: { reload: 'true' }})
}

onMounted(async () => {
  try {
    loading.openLoading()
    await setCateList()
    await getArticle()
  } catch (error) {
    console.log(error);
  } finally {
    loading.closeLoading()
  }
})
</script>
<style lang="scss" scoped>
.edit-page {
  :deep(.el-form-item) {
    .el-form-item__label {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
  .cate-select {
    width: 80%;
    max-width: 500px;
  }
  .editor-title {
    margin: 0 0 30px;
    color: #606266;
    font-size: 16px;
    font-weight: bold;
  }
  .editor-box {
    width: 100%;
    min-height: 300px;
    .editor {
      width: 100%;
      height: 400px;
      display: inline-block;
      border: none;
    }
  }
  
  .bottom {
    margin-top: 15px;
    display: flex;
    .save-btn {
      margin-left: auto;
    }
  }
}
</style>