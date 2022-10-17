<template>
  <div class="article-edit-page">
    <el-card>
      <el-form>
        <el-form-item label="文章分类">
          <el-select
            class="cate-select"
            v-model="articleForm.cate"
            multiple
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
        <el-form-item label="文章标题">
          <el-input 
            clearable 
            v-model="articleForm.title" 
            placeholder="请输入文章标题!"
          />
        </el-form-item>
        <div class="editor-title">文章内容</div>
        <div class="editor-box">
          <vue3-tinymce 
            ref="tinymceEditor" 
            v-model="articleForm.content" 
            :setting="juejin_setting"
          ></vue3-tinymce>
        </div>
      </el-form>
      <div class="bottom">
        <el-button class="save-btn" type="primary" plain @click="saveContent">保存</el-button>
      </div>
    </el-card>    
  </div>
</template>
<script lang="ts">
export default {
  name: 'ArticleEditExclude'
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, ref, reactive, onMounted, nextTick } from "vue";
import Vue3Tinymce from '@jsdawn/vue3-tinymce';
import { useRoute, useRouter } from "vue-router";
import loading from '@/utils/loading'
import { commonStore } from "@/store/index";
import { ElNotification } from "element-plus";


const editType = ref<string>('')
const $route = useRoute()
const $router = useRouter()
const app: any = getCurrentInstance();
const { getCategoryList } = app.proxy.$CateApi
const { updateArticle, getArticleById, createArticle } = app.proxy.$ArticleApi;
const cateList = ref<any[]>([])

/**
 * 表单数据
 */
const articleForm = reactive({
  title: '',
  cate: [],
  content: '',
  createdTime: ''
})

/**
 * 富文本编辑器设置
 */
const juejin_setting = {
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
  custom_images_upload_header: commonStore().getToken,
  images_upload_url: `${commonStore().uploadPath}aticles`,
  custom_images_upload_callback: (res:any) => {
    // console.log('上传图片回调', res);
    return res.url
  },
  custom_images_upload_param: 'aaaaaa.png',
  // 以中文简体为例
  language: 'zh_CN',
  language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js',
};

/**
 * 保存并提交
 */
const saveContent = async () => {
  articleForm.createdTime = getCurrentTime(new Date())
  // console.log('保存', articleForm);
  if (!articleForm.cate.length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请选择分类!'
    })
    return 
  }
  if (!articleForm.title.trim().length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请输入标题!'
    })
    return
  }
  if (!articleForm.content.trim().length) {
    ElNotification({
      duration: commonStore().tipDurationM,
      type: 'warning',
      message: '请输入文章内容!'
    })
    return
  }
  if (editType.value === 'edit') {
    // todo: 更新
    let res = await updateArticle($route.params?.id, articleForm)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: '更新成功!'
      })
    }
  } else {
    // 新增
    let res = await createArticle(articleForm)
    if (res.status === 200) {
      ElNotification({
        duration: commonStore().tipDurationM,
        type: 'success',
        message: '上传成功!'
      })
    }
  }
}

const formatTime = (num: number) => {
  return num > 10 ? num : `0${num}`
}

/**
 * 获取提交时间
 */
const getCurrentTime = (d: any) => {
  let year = d.getFullYear()
  let month = formatTime(d.getMonth() + 1)
  let date = formatTime(d.getDate())
  let hour = formatTime(d.getHours())
  let min = formatTime(d.getMinutes())
  let sec = formatTime(d.getSeconds())
  return `${year}-${month}-${date} ${hour}:${min}:${sec}`
}

/**
 * 获取分类
 */
const getCate = async () => {
  let res = await getCategoryList()
  let index = res.data.findIndex((i: any) => i.name === "新闻资讯")
  cateList.value.push(res.data[index].children)
  index = res.data.findIndex((i: any) => i.name === "赛事中心")
  cateList.value.push(res.data[index].children)
  cateList.value = cateList.value.flat()
  // console.log('分类', cateList.value);
}

/**
 * 获取数据
 */
const initAll = async () => {
  try {
    loading.openLoading()
    await getCate()
    if ($route.params?.id) {
      editType.value = 'edit'
      let res = await getArticleById($route.params?.id)
      // console.log(res.data);
      if (res.status === 200) {
        articleForm.cate = res.data.cate
        articleForm.title = res.data.title
        articleForm.content = res.data.content
      }
    } else {
      editType.value = 'add'
    }
  } catch (error) {
    console.log('获取文章错误', error);
    ElNotification({
      duration: commonStore().tipDurationS,
      title: 'Error',
      message: '获取文章数据失败了!',
      type: 'error',
    })
  } finally {
    loading.closeLoading()
  }
}

/**
 * 给iframe 设置滚动条样式
 */
const setScroll = () => {
  let i:any = document.querySelector('iframe')
  let h = i.contentWindow.document.querySelector('head')
  let s = document.createElement('style')
  s.innerText = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: hsl(0deg 0% 42% / 20%);
    border-radius: 10px;
    transition: all .2s ease-in-out;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  `
  h.appendChild(s)
}



onMounted(async () => {
  await initAll()
  let intervalTimer: any = null
  intervalTimer = setInterval(() => {
    if (app.proxy.$refs.tinymceEditor) {
      setScroll()
      clearInterval(intervalTimer)
      // console.log(app.proxy.$refs);
    } 
  }, 100)
})

</script>
<style lang="scss" scoped>
.article-edit-page {
  :deep(.el-form-item) {
    margin-bottom: 30px;
  }
  .cate-select {
    width: 60%;
  }
  .editor-title {
    margin: 25px 0 15px;
    color: #606266;
    font-size: 14px;
    font-weight: bold;
  }
  .editor-box {
    width: 100%;
    min-height: 300px;
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