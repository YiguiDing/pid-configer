<template>
  <ElTabs
    v-model="connectionManager.activeName"
    class="tab-wrapper"
    type="border-card"
    @tab-change="(key)=>connectionManager.active(key)"
  >
    <ElTabPane
      v-for="connection,key in connectionManager.connections"
      :name="key"
      :label="connection.name"
    >
      <SerialPortView
        v-if="(connection instanceof SerialPortConnection)"
        :connection="connection"
      />
      <TCPClientView
        v-else-if="(connection instanceof TCPClientConnection)"
        :connection="connection"
      />
    </ElTabPane>
  </ElTabs>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { ElTabs, ElTabPane } from "element-plus";
import { ConnectionManager } from "./src/connectionManager";
import SerialPortView from "./SerialPort.vue";
import TCPClientView from "./TCPClient.vue";
import UDPClientView from "./UDPClient.vue";
import { SerialPortConnection } from "./src/SerialPort";
import { TCPClientConnection } from "./src/TCPClient";
const connectionManager = reactive(new ConnectionManager());
defineExpose({ connetion: connectionManager.getActived() });
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
