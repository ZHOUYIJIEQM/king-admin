<template>
  <div class="article-edit-page">
    articleedit
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from "vue";

const app: any = getCurrentInstance();
const { getArticleList, articleSearch } = app.proxy.$ArticleApi;

</script>
<style lang="scss" scoped>

</style>