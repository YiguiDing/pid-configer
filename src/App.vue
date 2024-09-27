<script setup lang="ts">
import { onMounted, ref, toValue } from "vue";
import Chart from "./components/Chart.vue";
import {
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElSelect,
  ElOption,
  ElButton,
} from "element-plus";
const chartRef = ref<InstanceType<typeof Chart>>();

// ######################################
const ports = ref<Array<any>>([]);
import type { SerialPort as ISerialPort } from "serialport";
const { SerialPort } = require("serialport");
async function list() {
  ports.value = await SerialPort.list();
}
// ######################################
const port = ref<string>();
const baudRate = ref<number>();
let serialport: ISerialPort | null = null;
function connect() {
  serialport = new SerialPort({
    path: toValue(port),
    baudRate: toValue(baudRate),
  });
}
onMounted(() => {
  setInterval(() => {
    chartRef.value?.update(10, Math.random() * 100, 10, 5000);
  });
});
</script>

<template>
  <ElContainer class="wrapper">
    <ElContainer>
      <ElAside class="aside">
        <ElHeader class="header"><h2>测试标题</h2></ElHeader>
        <ElSelect v-model="port" @focus="list">
          <ElOption
            v-for="item in ports"
            :key="item.path"
            :label="item.friendlyName"
            :value="item.path"
          />
        </ElSelect>
        <ElButton @click="connect">connect</ElButton>
      </ElAside>
      <ElMain>
        <div class="content">
          <Chart ref="chartRef" />
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped lang="less">
.wrapper {
  width: 100%;
  height: 100%;
  .aside {
    width: 250px;
    padding: 10px;
    .header {
      height: 50px;
    }
  }
  .content {
    width: 100%;
    height: 100%;
  }
}
</style>
