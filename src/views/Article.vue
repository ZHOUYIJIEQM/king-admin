<template>
  <div class="">article</div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted } from "vue";

import axios from 'axios'

const app: any = getCurrentInstance();
const { getArticleList } = app.proxy.$ArticleApi;

const run = async () => {
  // let a = await getArticleList()
  try {
    let a = await axios({
      url: 'http://localhost:3011'
    })
    console.log('try', a);
  } catch (error) {
    console.log('catch', error);
  }
}

onMounted(async () => {
  run()
})

</script>
<style lang="scss" scoped></style>
