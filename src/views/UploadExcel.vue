<template>
  <div class="main-page">
    <input ref="excelUploadEl" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop"  @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      把Excel文件拖到这里或
      <el-button :loading="loading" type="primary" @click="handleUpload">
        选择打开
      </el-button>
    </div>

    <el-table
      border
      :data="excelData"
      style="margin-top: 2em;"
    >
    <!-- table-layout="auto" -->
      <el-table-column 
        v-for="(item, index) in header"
        :key="index"
        :prop="item"
        :label="item"
      />
    </el-table>
    
  </div>
</template>
<script lang="ts" setup>
import { importExcelFromBuffer } from "@/utils/excel";

const loading = ref<boolean>(false)
const excelData = ref<any[]>([]);
const excelUploadEl = ref()
const header = computed(() => {
  if (excelData.value.length) {
    let index = 0
    let keyLen = 0
    excelData.value.forEach((i, j) => {
      if (Object.keys(i).length > keyLen) {
        index = j
      }
    })
    return Object.keys(excelData.value[index])
  }
  return []
})

const handleUpload = (e: any) => {
  excelUploadEl.value.click()
}

const handleClick = (e) => {
  loading.value = true
  const files = e.target.files
  const rawFile = files[0]
  if (!rawFile) return
  // upload(rawFile)
  readExcel(rawFile)
}

const readExcel = (file: File) => {
  // 解决选择同一个文件不触发 input Change
  excelUploadEl.value.value = null
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  fileReader.onload = (event: any) => {
    try {
      const fileData = event.target.result
      excelData.value = importExcelFromBuffer(fileData)
      loading.value = false
    } catch (error) {
      console.log(error);
    }
  }
}

const handleDrop = (e) => {
  if(loading.value) return
  const files = e.dataTransfer.files
  // console.log(files);
  readExcel(files[0])
  e.stopPropagation()
  e.preventDefault()
}

const handleDragover = (e) => {
  e.dataTransfer.dropEffect = 'copy'
  e.stopPropagation()
  e.preventDefault()
}

</script>
<style lang="scss" scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>