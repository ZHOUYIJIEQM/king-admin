<template>
  <div id="tinyEditor" class="tiny-textarea"></div>
</template>
<script lang="ts">
export default {
  name: 'Vue3Tinymce'
};
</script>
<script lang="ts" setup>
let currentEditor = ref()

const props = withDefaults(
  defineProps<{
    modelValue: string;
    // 编辑器设置
    setting: any;
  }>(),
  {
    modelValue: "",
    setting: () => ({}),
  }
);
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateValue = (val: string) => emit('update:modelValue', val);
const getTinymce = () => {
  const root = typeof window !== 'undefined' ? window : global;
  return root && 'tinymce' in root ? root.tinymce : null;
};
const initEditor = () => {
  let setting = {
    selector: '#tinyEditor',
    ...props.setting,
    images_upload_handler: uploadHandler,
    setup: (editor) => {
      currentEditor.value = editor
      editor.on('init', () => onInited(editor))
    }
  }
  // console.log('初始化');
  getTinymce().init(setting)
}
const onInited = async editor => {
  await nextTick()
  editor.setContent(props.modelValue);
  editor.on('change input undo redo', e => {
    onChanged(e, editor)
  })
}
// 向父组件更新内容
const onChanged = (e, editor) => {
  const content = editor.getContent()
  updateValue(content)
}
/**
 * http://tinymce.ax-z.cn/general/upload-images.php
 * 处理文件上传
 * @param blobInfo
 * @param succFn
 * @param failFn
 */
const uploadHandler = (blobInfo: any, succFn: any, failFn: any) => {
  let xhr, formData, file;
  // 转化为易于理解的file对象
  file = blobInfo.blob();
  if (props.setting.custom_images_upload_header) {
    xhr = new XMLHttpRequest();
    xhr.withCredentails = false;
    xhr.open("POST", props.setting.images_upload_url);
    // console.log(file);
    Object.keys(props.setting.custom_images_upload_header).forEach((key) => {
      xhr.setRequestHeader(key, props.setting.custom_images_upload_header[key]);
    });
  }
  xhr.onload = () => {
    let json;
    if (xhr.status !== 200) {
      failFn(`Http Error: ${xhr.status}`);
      return;
    }
    json = JSON.parse(xhr.responseText);
    // console.log('json', json);

    if (!json) {
      failFn("Invalid JSON: " + xhr.responseText);
      return;
    }

    let backImgUrl =
      typeof props.setting.custom_images_upload_callback === "function"
        ? props.setting.custom_images_upload_callback(json)
        : json.location;

    if (!backImgUrl) {
      failFn("Failed Path (custom): location image path is error/empty");
      return;
    }

    succFn(backImgUrl);
  };
  formData = new FormData();
  formData.append("name", file.name);
  // formData.append('test', file.name)
  formData.append("file", file);
  xhr.send(formData);
}

watch(
  () => props.modelValue,
  (val) => {
    // console.log('传入数据文本', currentEditor.value.initialized);
    if (currentEditor.value.initialized) {
      currentEditor.value.setContent(val)
    }
  }
);

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  getTinymce().remove()
})

</script>