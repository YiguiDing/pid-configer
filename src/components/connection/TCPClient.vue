<template>
  <div class="row">
    <ElInput v-model="host" placeholder="192.168.1.1">
      <template #prepend>host:</template>
    </ElInput>
  </div>
  <div class="row">
    <ElInput v-model="port" placeholder="8080">
      <template #prepend>port:</template>
    </ElInput>
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
import { ElButton, ElInput } from "element-plus";
import net, { Socket } from "node:net";

const host = ref<string>("");
const port = ref<number | null>(null);
let socket = ref<Socket | null>(null);
let isConnected = ref(false);
function connect() {
  if (!toValue(host) && !toValue(port)) return;
  socket.value = net.createConnection({
    host: toValue(host),
    port: toValue(port)!,
  });
  isConnected.value = true;
}

function disconnect() {
  socket.value?.destroy();
  socket.value = null;
  isConnected.value = false;
}

onUnmounted(disconnect);
defineExpose({ stream: socket });
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
  // :deep(.el-input-group__prepend) {
  // background-color: var(--el-fill-color-blank);
  // width: 80px;
  // }
}
</style>
