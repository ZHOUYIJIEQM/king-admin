<template>
  <!-- 上传组件 -->
  <div class="upload-file-comp">
    <el-upload
      class="avatar-uploader"
      :action="actionUrl"
      :headers="token"
      :data="uploadData"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
    >
      <img class="avatar" lazy v-if="imageUrl" :src="imageUrl" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import type { UploadProps } from "element-plus";
import { commonStore } from "../store/index";

const token = commonStore().getToken

// 保存上传文件名
const uploadData = ref({});

const props = withDefaults(
  defineProps<{
    actionUrl: string;
    imageUrl?: string;
    maxFileSize?: number;
  }>(),
  {
    actionUrl: "",
    imageUrl: "",
    maxFileSize: 2,
  }
);

const emit = defineEmits<{
  (e: 'uploadSuccess', picUrl: string): void
}>()

// 上传成功后
const handleUploadSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  // emit('uploadSuccess', URL.createObjectURL(uploadFile.raw!))
  emit('uploadSuccess', response.url)
};

const handleUploadError = (error, uploadFile, uploadFiles) => {
  console.log('上传失败!', error);
  ElNotification({
    duration: commonStore().tipDurationS,
    title: 'Error',
    message: `图片上传失败了!`,
    type: 'error',
  })
}

// 上传前
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  uploadData.value = { name: rawFile.name };
  if (rawFile.size / 1024 / 1024 > props.maxFileSize) {
    ElNotification({
      duration: commonStore().tipDurationS,
      title: 'Error',
      message: `图片不能大于${props.maxFileSize}M!`,
      type: 'error',
    })
    return false;
  }
  return true;
};
</script>
<style lang="scss" scoped>
.upload-file-comp {
  :deep(.avatar-uploader) {
    $elIconWidth: 200px;
    .avatar {
      width: 100%;
    }
    .el-upload {
      box-sizing: border-box;
      width: $elIconWidth;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: $elIconWidth;
      height: $elIconWidth;
      text-align: center;
    }
  }
}
</style>
