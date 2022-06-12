<template>
  <div class="welcome">
    <div class="content">
      <p class="title">
        <span class="text">王者荣耀后台管理系统</span>
      </p>
      <p class="feature">功能:</p>
      <p class="list">分类管理:  对分类增删改</p>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.welcome {
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