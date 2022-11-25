import { ElLoading } from 'element-plus'
let loadingFlag: any = null
/**
 * 加载提示
 */
function openLoading() {
  loadingFlag = ElLoading.service({
    lock: true,
    text: '正在加载...',
    background: 'rgba(0, 0, 0, 0.6)',
  })
}

/**
 * 关闭加载提示
 */
function closeLoading() {
  setTimeout(() => {
    loadingFlag.close()
  }, 300)
}

export default {
  openLoading,
  closeLoading
}
