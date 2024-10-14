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
        <Terminal
          class="Terminal"
          :stream="connectionManager?.stream || null"
          :cmd="controllerManager?.commander || null"
        />
        <DiagramManager
          class="DiagramManager"
          ref="dragramManager"
          :channals="controllerManager?.channals || []"
        />
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
    display: flex;
    flex-direction: column;

    & > .Terminal {
      width: 100%;
      max-height: 50%;
      margin-bottom: 15px;
    }
    & > .DiagramManager {
      width: 100%;
      height: fit-content;
    }
  }
}
</style>

<style lang="less"></style>
