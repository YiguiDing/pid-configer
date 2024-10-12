<template>
  <div class="row">
    <ElSelect v-model="path" @focus="list">
      <ElOption
        v-for="port in ports"
        :value="port.path"
        :label="port.device_name"
      />
    </ElSelect>
  </div>
  <div class="row">
    <ElSelect v-model="baudRate">
      <ElOption v-for="rate in baudRates" :value="rate" :label="rate" />
    </ElSelect>
  </div>
  <div class="row">
    <ElButton
      v-if="!isConnected"
      @click="connect"
      type="primary"
      v-text="'connect'"
    />
    <ElButton v-else @click="disconnect" type="danger" v-text="'disconnect'" />
  </div>
</template>
<script lang="ts" setup>
import { onUnmounted, ref, toValue, defineExpose } from "vue";
import { ElButton, ElOption, ElSelect } from "element-plus";
import type { SerialPort as ISerialPort } from "serialport";
const SerialPort = require("serialport").SerialPort as typeof ISerialPort;

const baudRates = [
  300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200,
];
const baudRate = ref<number>(9600);
const ports = ref<{ path: string; device_name: string }[]>();
const path = ref<string>("");
let serialPort = ref<ISerialPort | null>(null);
let isConnected = ref(false);

async function list() {
  ports.value = await SerialPort.list();
}

function connect() {
  if (!toValue(path) && !toValue(baudRate)) return;
  serialPort.value = new SerialPort({
    path: toValue(path),
    baudRate: toValue(baudRate),
  });
  isConnected.value = true;
}

function disconnect() {
  serialPort.value?.close();
  serialPort.value = null;
  isConnected.value = false;
}

onUnmounted(disconnect);
defineExpose({ stream: serialPort });
</script>
<style lang="less" scoped>
.row {
  width: 100%;
  margin-bottom: 5px;

  &:nth-last-child(1) {
    margin-bottom: 0px;
  }

  & > * {
    width: 100%;
  }
}
</style>
