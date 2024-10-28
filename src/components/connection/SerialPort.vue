<template>
  <div class="row">
    <ElSelect v-model="connection.path" @focus="connection.list()">
      <ElOption
        v-for="item in connection.paths"
        :value="item.path"
        :label="item.device_name"
      />
    </ElSelect>
  </div>
  <div class="row">
    <ElSelect v-model="connection.baudRate">
      <ElOption
        v-for="item in connection.baudRates"
        :value="item"
        :label="item"
      />
    </ElSelect>
  </div>
  <div class="row">
    <ElButton
      v-if="!connection.isConnect()"
      @click="connection.connect()"
      type="primary"
      v-text="'connect'"
    />
    <ElButton
      v-else
      @click="connection.disonnect()"
      type="danger"
      v-text="'disconnect'"
    />
  </div>
</template>
<script lang="ts" setup>
import { onUnmounted, defineExpose, defineProps } from "vue";
import { ElButton, ElOption, ElSelect } from "element-plus";
import { SerialPortConnection } from "./src/SerialPort";
const { connection } = defineProps<{ connection: SerialPortConnection }>();
onUnmounted(() => connection.disonnect());
defineExpose({ connection });
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
