<template>
  <ElTabs v-model="selected" type="card" editable @edit="edit">
    <ElTabPane v-for="ch of channals" :key="ch" :name="ch" :label="`ch:${ch}`">
      <!-- @vue-ignore -->
      <Controller :ch="ch" :cmd="cmd" />
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref, defineProps, toValue, watchEffect } from "vue";
import { ElTabs, ElTabPane, TabPaneName } from "element-plus";
import { Commander } from "@/lib/Commander";
import { Dragram } from "@/lib/type/Dragram";
import Controller from "./Controller.vue";
import { Duplex } from "node:stream";

const props = defineProps<{
  stream: Duplex | null;
  dragram: Dragram | null;
}>();

const cmd = new Commander();

watchEffect(() => {
  cmd.connectStream(props.stream);
});
watchEffect(() => {
  cmd.connectDragram(props.dragram);
});

const selected = ref(1);
const channals = ref([1]);

function edit(pane: TabPaneName | undefined, action: "add" | "remove") {
  let _chs = toValue(channals);
  switch (action) {
    case "add":
      if (_chs.length > 0) _chs.push(_chs[_chs.length - 1] + 1);
      else _chs.push(1);
      break;
    case "remove":
      _chs = _chs.filter((i) => i != pane);
      break;
  }
  channals.value = _chs;
}

defineExpose({ channals });
</script>

<style scoped lang="less"></style>
