<script setup lang="ts">
import { onMounted, ref, toValue, watch } from "vue";
import { ElInput, ElSlider } from "element-plus";
import { Commander } from "@/lib/Commander";

const props = defineProps<{ ch: number; cmd: Commander }>();

const target = ref(0);
const Kp = ref(0);
const Ki = ref(0);
const Kd = ref(0);
const limit = ref(0);
const roc = ref(0);

onMounted(() => {
  watch(Kp, () => props.cmd.setKp(props.ch, toValue(Kp)));
  watch(Ki, () => props.cmd.setKp(props.ch, toValue(Ki)));
  watch(Kd, () => props.cmd.setKp(props.ch, toValue(Kd)));
  watch(limit, () => props.cmd.setKp(props.ch, toValue(limit)));
  watch(roc, () => props.cmd.setKp(props.ch, toValue(roc)));
  watch(target, () => props.cmd.setKp(props.ch, toValue(target)));
});
</script>

<template>
  <ElInput class="row" type="number" v-model.number="Kp">
    <template #prepend>Kp:</template>
    <template #append>
      <ElSlider class="row" v-model.number.lazy="Kp" :min="0" :max="0xffff" />
    </template>
  </ElInput>

  <ElInput class="row" type="number" v-model.number="Ki">
    <template #prepend>Ki:</template>
    <template #append>
      <ElSlider class="row" v-model.number.lazy="Ki" :min="0" :max="0xffff" />
    </template>
  </ElInput>

  <ElInput class="row" type="number" v-model.number="Kd">
    <template #prepend>Kd:</template>
    <template #append>
      <ElSlider class="row" v-model.number.lazy="Kd" :min="0" :max="0xffff" />
    </template>
  </ElInput>

  <ElInput class="row" type="number" v-model.number="limit">
    <template #prepend>limit:</template>
    <template #append>
      <ElSlider
        class="row"
        v-model.number.lazy="limit"
        :min="0"
        :max="0xffff"
      />
    </template>
  </ElInput>

  <ElInput class="row" type="number" v-model.number="roc">
    <template #prepend>roc:</template>
    <template #append>
      <ElSlider class="row" v-model.number.lazy="roc" :min="0" :max="0xffff" />
    </template>
  </ElInput>

  <ElInput class="row" type="number" v-model.number="target">
    <template #prepend>target:</template>
    <template #append>
      <ElSlider
        class="row"
        v-model.number.lazy="target"
        :min="-0xffff"
        :max="0xffff"
      />
    </template>
  </ElInput>
</template>

<style scoped lang="less">
.row {
  width: 100%;
  margin-bottom: 5px;
  padding-left: 5px;

  &:nth-last-child(1) {
    margin-bottom: 0px;
  }
  &:deep(.el-input-group__prepend) {
    // background-color: var(--el-fill-color-blank);
    width: 150px;
    justify-content: right;
    padding-right: 10px;
  }
  &:deep(.el-input-group__append) {
    background-color: var(--el-fill-color-blank);
    padding: 0 5px;
  }
  :deep(.el-slider) {
    min-width: 150px;
    margin-left: 5px;

    --height: 20px;
    --width: 15px;

    .el-input-number {
      max-width: 100px;
    }

    .el-slider__bar,
    .el-slider__runway {
      height: var(--height);
      margin-right: 10px;
      position: relative;

      .el-slider__button-wrapper {
        position: absolute;
        top: 0;
        width: var(--width);
        height: var(--height);

        .el-slider__button {
          display: block;
          width: var(--width);
          height: var(--height);
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
