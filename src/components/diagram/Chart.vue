<script setup lang="ts">
import dayjs from "dayjs";
import * as echarts from "echarts";
import { ElInputNumber } from "element-plus";
import { onMounted, onBeforeUnmount, ref, toValue } from "vue";

const { title } = defineProps<{ title: string }>();
const T_ms = ref(5000);

type DataItem = [Date, number];

const time_table_ms: number[] = [];
const curent_output: DataItem[] = [];
const target_output: DataItem[] = [];
const option: echarts.EChartsOption = {
  title: { text: title },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      animation: false,
    },
  },
  xAxis: {
    type: "time",
    axisLabel: {
      rotate: 45,
      // @ts-ignore
      interval: "auto",
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, "50%"],
    splitLine: {
      show: false,
    },
  },
  grid: {
    top: 40,
    left: 40,
    right: 10,
    bottom: 60,
  },
  series: [
    {
      name: "当前值",
      type: "line",
      showSymbol: false,
      animation: false,
      data: curent_output,
      itemStyle: {
        // @ts-ignore
        normal: {
          lineStyle: {
            width: 2,
          },
        },
      },
    },
    {
      name: "目标值",
      type: "line",
      showSymbol: false,
      animation: false,
      data: target_output,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 2,
          },
        },
      },
    },
  ],
};

const chartWrapper = ref<HTMLDivElement>();
let myChart: echarts.ECharts | null = null;
let time_ms_now = 0;
const resizeObserver = new ResizeObserver(() =>
  myChart?.resize({ height: toValue(chartWrapper)!.clientHeight })
);
function init() {
  resizeObserver.observe(toValue(chartWrapper)!);
  myChart = echarts.init(toValue(chartWrapper));
  myChart.setOption(option);
}
function destory() {
  resizeObserver.disconnect();
  myChart = null;
}
function update(target_val: number, curent_val: number) {
  let now = dayjs().valueOf();
  time_table_ms.push(now);
  curent_output.push([dayjs(now).toDate(), +curent_val.toFixed(5)]);
  target_output.push([dayjs(now).toDate(), +target_val.toFixed(5)]);
  while (!!time_table_ms[0] && time_table_ms[0] < now - toValue(T_ms)) {
    time_table_ms.shift();
    curent_output.shift();
    target_output.shift();
  }
  myChart?.setOption({
    series: [{ data: curent_output }, { data: target_output }],
  });
}
//
onMounted(init);
onBeforeUnmount(destory);
defineExpose({ update });
</script>
<template>
  <div class="echart-wrapper">
    <div class="chart" ref="chartWrapper" />
    <ElInputNumber
      v-model="T_ms"
      class="input"
      size="small"
      controls-position="right"
      :min="1"
      :max="30000"
    >
      <template #prefix>
        <span>T</span>
      </template>
      <template #suffix>
        <span>ms</span>
      </template>
    </ElInputNumber>
  </div>
</template>
<style lang="less">
.echart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .chart {
    width: 100%;
    height: 100%;
  }
  .input {
    position: absolute;
    width: 150px;
    right: 5px;
    bottom: 5px;
  }
}
</style>
