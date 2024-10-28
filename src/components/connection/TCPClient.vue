<template>
  <div class="row">
    <ElInput v-model="connection.host" placeholder="192.168.1.1">
      <template #prepend>host:</template>
    </ElInput>
  </div>
  <div class="row">
    <ElInput v-model.number="connection.port" placeholder="8080">
      <template #prepend>port:</template>
    </ElInput>
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
import { onUnmounted, defineExpose, reactive } from "vue";
import { ElButton, ElInput } from "element-plus";
import { TCPClientConnection } from "./src/TCPClient";

let connection = reactive(new TCPClientConnection());
onUnmounted(() => connection.connect());
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
  // :deep(.el-input-group__prepend) {
  // background-color: var(--el-fill-color-blank);
  // width: 80px;
  // }
}
</style>
