<script setup lang="ts">
import { onMounted, ref, toValue, watch } from "vue";
import Chart from "./components/Chart.vue";
import { ElContainer, ElHeader, ElAside, ElMain, ElSelect, ElOption, ElButton, ElRow, ElCol, ElSlider } from "element-plus";
const chartRef = ref<InstanceType<typeof Chart>>();
// ######################################
const ports = ref<Array<any>>([]);
import type { SerialPort as ISerialPort } from "serialport";
const { SerialPort } = require("serialport");
async function list() {
  ports.value = await SerialPort.list();
}
// ######################################
const port = ref<string>();
const baudRate = ref<number>();
let serialport = ref<ISerialPort | null>();
function connect() {
  disconnect();
  serialport.value = new SerialPort({
    path: toValue(port),
    baudRate: toValue(baudRate),
  });
  serialport.value?.on('data', (data: Buffer) => {
    let msg = data.toString('ascii').split('\n')[0];
    let nums = msg.split(',').map(Number);
    chartRef.value?.update(nums[0], nums[1], nums[2], toValue(Tms));
  })
}
function disconnect() {
  serialport.value?.close();
  serialport.value = null
}
const Tms = ref(1000)

const mode = ref(0)
watch(mode, () => serialport.value?.write(`M${mode.value}\n`, 'ascii'))

const target = ref(0)
watch(target, () => serialport.value?.write(`T${target.value}\n`, 'ascii'))

const i_Kp = ref(0)
watch(i_Kp, () => serialport.value?.write(`p${i_Kp.value}\n`, 'ascii'))

const i_Ki = ref(0)
watch(i_Ki, () => serialport.value?.write(`i${i_Ki.value}\n`, 'ascii'))

const i_Kd = ref(0)
watch(i_Kd, () => serialport.value?.write(`d${i_Kd.value}\n`, 'ascii'))

const v_Kp = ref(0)
watch(v_Kp, () => serialport.value?.write(`P${v_Kp.value}\n`, 'ascii'))

const v_Ki = ref(0)
watch(v_Ki, () => serialport.value?.write(`I${v_Ki.value}\n`, 'ascii'))

const v_Kd = ref(0)
watch(v_Kd, () => serialport.value?.write(`D${v_Kd.value}\n`, 'ascii'))

// onMounted(() => {
//   setInterval(() => {
//     chartRef.value?.update(10, Math.random() * 100, 10, 5000);
//   });
// });
</script>

<template>
  <ElContainer class="wrapper">
    <ElContainer>
      <ElAside class="aside">
        <ElHeader>
          <ElRow>
            <ElCol>
              <h2>测试标题</h2>
            </ElCol>
          </ElRow>
        </ElHeader>

        <ElRow>
          <ElCol :span="24">
            <ElSelect v-model="port" @focus="list">
              <ElOption v-for="item in ports" :key="item.path" :label="item.friendlyName" :value="item.path" />
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElSelect v-model="baudRate">
              <ElOption v-for="item in [115200]" :key="item" :label="item" :value="item" />
            </ElSelect>
          </ElCol>
        </ElRow>
        <ElRow v-if="port && baudRate">
          <ElCol>
            <ElButton style="width: 100%;" v-if="!serialport" @click="connect">connect</ElButton>
            <ElButton style="width: 100%;" v-else @click="disconnect">disconnect</ElButton>
          </ElCol>
        </ElRow>
        <template v-if="serialport">
          <ElRow>
            <ElCol>
              Tms:
              <ElSlider v-model="Tms" :min="0" :max="10000" />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              mode:
              <ElSelect v-model="mode">
                <ElOption v-for="item in [
                  { lable: 'voltage', value: 0 },
                  { lable: 'current', value: 1 },
                  { lable: 'velocity', value: 2 },
                ]" :key="item.value" :label="item.lable" :value="item.value" />
              </ElSelect>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              target:
              <ElSlider v-model="target" :min="-100" :max="100" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              i_Kp:
              <ElSlider v-model="i_Kp" :min="0" :max="100" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              i_Ki:
              <ElSlider v-model="i_Ki" :min="0" :max="500" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              i_Kd:
              <ElSlider v-model="i_Kd" :min="-100" :max="100" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              v_Kp:
              <ElSlider v-model="v_Kp" :min="0" :max="100" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              v_Ki:
              <ElSlider v-model="v_Ki" :min="0" :max="500" show-input />
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol>
              v_Kd:
              <ElSlider v-model="v_Kd" :min="-100" :max="100" show-input />
            </ElCol>
          </ElRow>
        </template>
      </ElAside>
      <ElMain>
        <div class="content">
          <Chart ref="chartRef" />
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped lang="less">
.wrapper {
  width: 100%;
  height: 100%;

  .aside {
    width: 400px;
    padding: 10px;
  }

  .content {
    width: 100%;
    height: 100%;
  }
}
</style>
