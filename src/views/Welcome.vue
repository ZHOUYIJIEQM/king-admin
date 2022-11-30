<template>
  <div class="main-page">
    <div class="content">
      <span class="title spotlight" :data-text="$t(`text.kingBg`)">{{$t(`text.kingBg`)}}</span>
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
<style lang="scss" scoped>
.main-page {
  .content {
    .title {
      text-transform: uppercase;
      background: linear-gradient(90deg, #9d7c4d 25%, #0a3281 75%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 4.5rem;
      padding: 60px 0;
    }
  }
}
</style>