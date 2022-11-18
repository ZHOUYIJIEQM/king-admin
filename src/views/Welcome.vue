<template>
  <div class="main-page">
    <div class="content">
      <p class="title">
        <span class="text">王者荣耀后台管理系统</span>
      </p>
      <!-- <p class="feature">介绍:</p>
      <p class="list">管理员: 具有所有权限</p>
      <p class="list">普通用户: 仅可读权限, 无法修改后台数据</p>
      <p class="list">分类管理: 对分类增删改</p>
      <p class="list">物品管理: 对装备列表进行增删改</p>
      <p class="list">英雄管理: 对英雄列表进行增删改查</p>
      <p class="list">文章管理: 对文章列表进行增删改查</p>
      <p class="list">广告管理: 对广告列表进行增删改查</p>
      <p class="list">用户管理: 对用户列表进行增删改查</p> -->
<pre>

</pre>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.main-page {
  .content {
    padding: 0 50px;
    .title {
      display: flex;
      justify-content: center;
      font-size: 30px;
      font-weight: bold;
      .text {
        background: linear-gradient(90deg, #f29914 25%, #0c3b9a 75%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    p {
      line-height: 3;
      &.list {
        line-height: 2;
      }
    }
  }  
}
</style>