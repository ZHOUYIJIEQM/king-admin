<template>
  <div class="ad-page">
    <el-card class="ad-card-box">
      <CardItemVue 
        class="ad-item"
        v-for="(item, index) in allList"
        :key="item._id"
        :title="item.name"
        @close-item="allList.splice(index, 1)"
      >
        <el-form>
          <el-form-item label="轮播名" style="margin-bottom: 0px;">
            <el-input style="margin-bottom: 15px;" clearable class="short-input" v-model="item.name" placeholder="请输入轮播名称!"></el-input>
          </el-form-item>
        </el-form>
        <div class="inner-box">
          <CardItemVue
            class="card-item"
            v-for="(item1, index1) in item.items"
            :key="item1._id"
            :title="`轮播${index1+1}`"
            @close-item="item.items.splice(index, 1)"
          >
            <UploadFileVue
              class="hero-avatar"
              :actionUrl="actionUrl"
              :imageUrl="item1.img"
              @uploadSuccess="uploadSuccess($event, item1, 'img')"
            ></UploadFileVue>
          </CardItemVue>
          <div class="card-item">
            <el-button class="add-ad-item" @click="addAdItem(item.items)">
              <el-icon :size="30" class="plus"><Plus /></el-icon>
              <div style="margin-top: 15px;">添加一个轮播项</div>
            </el-button>
          </div>
        </div>
      </CardItemVue>
      <el-button class="add-ad-item" @click="addAd(allList)">
        <el-icon :size="30" class="plus"><Plus /></el-icon>
        <div style="margin-top: 15px;">添加一个轮播</div>
      </el-button>
      <div class="bottom">
        <el-button class="save-btn" type="primary" plain @click="saveContent">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import loading from '@/utils/loading'
import CardItemVue from "@/components/CardItem.vue";
import UploadFileVue from "@/components/UploadFile.vue";
import { Plus } from '@element-plus/icons-vue'

const app: any = getCurrentInstance()
const { proxy } = app
const { getAd } = proxy.$AdApi
const allList = ref<any[]>([])
const actionUrl = 'http://localhost:3080/admin/api/upload/advertisement'

/**
 * 上传后
 */
const uploadSuccess = (val: string, data: any, key: string) => {
  console.log(val, data, key);
  data[key] = val
}

/**
 * 获取所有轮播
 */
const getAllAd = async () => {
  try {
    loading.openLoading()
    let res = await getAd()
    // console.log('广告', res);
    allList.value = res.data.data
    console.log(allList.value);
  } catch (error) {
    console.log(error); 
  } finally {
    loading.closeLoading()
  }
}

const addAd = (val: any) => {
  val.push({
    name: '',
    items: [],
  })
}

const addAdItem = (val: any) => {
  val.push({
    img: "",
    url: ""
  })
}

const saveContent = () => {
  console.log('------', allList.value);
}

onMounted(async () => {
  await getAllAd()
})

</script>
<style lang="scss" scoped>
.ad-page {
  .ad-card-box {
    min-height: 500px;
  }
  :deep(.ad-item) {
    margin-bottom: 50px;
    &:hover {
      border-color: #9b9b9b;
    }
    &>.top {
      border-width: 2px;
    }
    &>.center {
      padding-bottom: 8px;
    }
  }
  :deep(.el-upload) {
    width: 100% !important;
  }
  :deep(.add-ad-item) {
    border-width: 2px;
    border-style: dashed;
    width: 100%;
    height: 100%;
    min-height: 200px;
    &>span {
      display: inline-flex;
      align-items: center;
      flex-direction: column;
    }
  }
  .inner-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .card-item {

      width: 49.5%;
      margin-bottom: 1%;
      box-sizing: border-box;
    }
  }
  
  .bottom {
    margin-top: 20px;
    display: flex;
    .save-btn {
      margin-left: auto;
    }
  }
}
</style>