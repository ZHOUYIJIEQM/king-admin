<template>
  <div class="">
    test - text
    {{ one }} {{ two }}
    <button @click="clickEmit">emit</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const a = 1;
const b = ref(2);
defineExpose({
  a,
  b,
});

defineProps({
  one: String,
  two: Number,
});

const emit = defineEmits<{
  (e: "change", id: number): void
}>()
const clickEmit = () => {
  emit('change', 9527)
}

</script>
<style lang="scss" scoped></style>
