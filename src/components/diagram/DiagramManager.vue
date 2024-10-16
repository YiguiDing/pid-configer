<template>
  <div class="echars-wrapper">
    <!-- @vue-ignore -->
    <Chart
      v-for="ch of props.channals"
      :key="ch"
      :title="`通道:${ch}`"
      :ref="(el) => (Charts[ch] = el)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toValue } from "vue";
import Chart from "./Chart.vue";
import { Dragram } from "@/lib/type/Dragram";

const props = defineProps<{ channals: Array<number> }>();
const Charts = ref<{ [key in number]: InstanceType<typeof Chart> }>({});

defineExpose(<Dragram>{
  draw(channel, target, output) {
    toValue(Charts)[channel]?.update(target, output, 1000);
  },
});
</script>

<style lang="less">
.echars-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: start;
  & > * {
    flex: 1;
    min-width: 300px;
    max-height: 250px;
    margin-right: 15px;
    margin-bottom: 15px;
    /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
