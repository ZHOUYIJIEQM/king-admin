<template>
  <div class="chart-content" ref="chartEl"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([ TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout ]);

const props = withDefaults(
  defineProps<{
    chartOption: any
  }>(),
  {
    chartOption: {}
  }
)

// 获取元素
const chartEl = ref()
let myChart: any = null

/**
 * 初始化图表
 */
const initChart = () => {
  myChart = echarts.init(chartEl.value, null, {
    // window.devicePixelRatio 还是模糊, 调大点反而清晰了
    // devicePixelRatio: window.devicePixelRatio + 0.5,
    // devicePixelRatio: 2,
    // renderer: 'svg',
    // 设置宽高后文字清晰了
    height: 210,
    width: 300
  });
  myChart.setOption(props.chartOption);
  window.addEventListener('resize', myChart.resize);
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', myChart.resize);
  myChart.dispose
})

</script>
<style lang="scss" scoped>
.chart-content {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>