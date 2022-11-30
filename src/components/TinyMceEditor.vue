<template>
  <editor
    class="editor"
    v-model="editorContent"
    api-key="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
    :init="editorSetting"
  />
</template>
<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const props = withDefaults(defineProps<{
  editorContent: string
  // 富文本编辑器设置
  setting: any
}>(), {
  editorContent: '',
  setting: () => ({})
})

const emit = defineEmits<{
  (e: 'update:editorContent', value: string): void
}>()

const getTinymce = () => {
  return 'tinymce' in window ? (window as any).tinymce : null;
};

const editorSetting = reactive({
  ...props.setting,
  images_upload_handler: uploadHandler
})

/**
 * http://tinymce.ax-z.cn/general/upload-images.php
 * 处理文件上传
 * @param blobInfo 
 * @param succFn 
 * @param failFn 
 */
function uploadHandler(blobInfo: any, succFn: any, failFn: any) {
  let xhr, formData, file;
  // 转化为易于理解的file对象
  file = blobInfo.blob()
  if (props.setting.custom_images_upload_header) {
  xhr = new XMLHttpRequest()
  xhr.withCredentails = false
  xhr.open('POST', props.setting.images_upload_url)
  // console.log(file);
    Object.keys(props.setting.custom_images_upload_header).forEach((key) => {
      xhr.setRequestHeader(key, props.setting.custom_images_upload_header[key]);
    });
  }
  xhr.onload = () => {
    let json;
    if (xhr.status !== 200) {
      failFn(`Http Error: ${xhr.status}`)
      return;
    }
    json = JSON.parse(xhr.responseText)
    // console.log('json', json);

    if (!json) {
      failFn('Invalid JSON: ' + xhr.responseText);
      return;
    }

    let backImgUrl = typeof props.setting.custom_images_upload_callback === 'function' ? props.setting.custom_images_upload_callback(json) : json.location;

    if (!backImgUrl) {
      failFn('Failed Path (custom): location image path is error/empty');
      return;
    }

    succFn(backImgUrl)
  }
  formData = new FormData()
  formData.append('name', file.name)
  // formData.append('test', file.name)
  formData.append('file', file)
  xhr.send(formData)
}

let intervalTimer: any = null
/** 给iframe 设置滚动条样式 */
const setScroll = () => {
  let i: any = document.querySelector('iframe[id^="tiny-vue"]')
  if (!i) return
  let h = i.contentWindow.document.querySelector('head')
  clearInterval(intervalTimer)
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

onMounted(() => {
  intervalTimer = setInterval(() => {
    // console.log('--');
    if (getTinymce()) {
      // console.log('有editor');
      setScroll()
    }
  }, 250)
})

</script>
<style lang="scss" scoped>

</style>