<template>
  <ElContainer class="wrapper">
    <ElContainer>
      <ElAside class="aside">
        <ElRow style="margin-bottom: 15px">
          <ElCol :span="24">
            <ConnectionManager ref="connectionManager" />
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ControllerManager
              ref="controllerManager"
              :stream="connectionManager?.stream || null"
              :dragram="dragramManager || null"
            />
          </ElCol>
        </ElRow>
      </ElAside>
      <ElMain class="content">
        <DiagramManager
          ref="dragramManager"
          :channals="controllerManager?.channals || []"
        />
        <!-- <ElRow> </ElRow> -->
        <!-- <ElRow>
          <Terminal :stream="connectionManager?.stream || null" />
        </ElRow> -->
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElContainer, ElAside, ElMain, ElRow, ElCol } from "element-plus";
import ConnectionManager from "@/components/connection/ConnectionManager.vue";
import ControllerManager from "@/components/controller/ControllerManager.vue";
import DiagramManager from "@/components/diagram/DiagramManager.vue";
import Terminal from "@/components/terminal/Terminal.vue";

const connectionManager = ref<InstanceType<typeof ConnectionManager>>();
const controllerManager = ref<InstanceType<typeof ControllerManager>>();
const dragramManager = ref<InstanceType<typeof DiagramManager>>();
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;

  .aside {
    width: 350px;
    padding: 10px;
  }

  .content {
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="less"></style>
