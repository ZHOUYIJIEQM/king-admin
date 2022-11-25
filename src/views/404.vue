<template>
  <div class="main-page not-fount spotlight" :data-text="$t(`text.notFound`)">
    {{$t(`text.notFound`)}}
  </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.not-fount {
  line-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  font-weight: bold;
}
</style>