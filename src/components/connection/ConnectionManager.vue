<template>
  <ElTabs v-model="activeName" class="tab-wrapper" type="border-card">
    <ElTabPane v-for="key of Object.keys(view)" :name="key" :label="key">
      <!-- @vue-ignore -->
      <component :is="view[key]" :ref="(el) => (connections[key] = el)" />
    </ElTabPane>
  </ElTabs>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { ElTabs, ElTabPane } from "element-plus";
import SerialPort from "./SerialPort.vue";
import TCPClient from "./TCPClient.vue";
import UDPClient from "./UDPClient.vue";
const view = { SerialPort, TCPClient, UDPClient };
const activeName = ref("SerialPort");
type Map = {
  [key in string]:
    | InstanceType<typeof SerialPort>
    | InstanceType<typeof TCPClient>;
};
const connections = ref<Map>({});
defineExpose({
  stream: computed(() => connections.value[activeName.value].stream),
});
</script>
<style lang="less" scoped>
.tab-wrapper {
  :deep(.el-tabs__header) {
    --el-tabs-header-height: 35px;
  }
  :deep(.el-tabs__content) {
    padding: 8px;
  }
}
</style>
