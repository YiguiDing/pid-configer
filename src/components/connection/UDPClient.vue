<template>
  <div class="row">
    <ElInput :model-value="local_addr" placeholder="0.0.0.0">
      <template #prepend>local_addr:</template>
    </ElInput>
  </div>
  <div class="row">
    <ElInput v-model="local_port" placeholder="8080">
      <template #prepend>local_port:</template>
    </ElInput>
  </div>
  <div class="row">
    <ElInput v-model="remote_addr" placeholder="192.168.1.2">
      <template #prepend>remote_addr:</template>
    </ElInput>
  </div>
  <div class="row">
    <ElInput v-model="remote_port" placeholder="8080">
      <template #prepend>remote_port:</template>
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
import dgram, { Socket } from "node:dgram";
import { Duplex } from "node:stream";

class UDPStream extends Duplex {
  socket: Socket;
  constructor(
    public local_addr: string,
    public local_port: number,
    public remote_addr: string,
    public remote_port: number
  ) {
    super({
      objectMode: true,
      allowHalfOpen: false,
    });
    this.socket = dgram.createSocket("udp4");
    this.socket.on("message", (msg, { address, port }) => {
      if (this.remote_addr == address && this.remote_port == port) {
        this.push(msg);
      }
    });
    this.socket.on("listening", () => {
      console.log(
        `UDPStream is listening on ${this.socket.address().address}:${
          this.socket.address().port
        }`
      );
    });
    this.socket.on("error", (err) => {
      console.error(`UDPStream error:\n${err.stack}`);
      this.emit("error", err);
    });
    this.socket.bind(this.local_port, this.local_addr);
  }

  // @ts-ignore
  _write(chunk: Buffer, encoding, callback) {
    this.socket.send(
      chunk,
      0,
      chunk.length,
      this.remote_port,
      this.remote_addr,
      (err) => {
        if (err) return callback(err);
        callback();
      }
    );
  }

  // @ts-ignore
  _final(callback) {
    // 在结束时关闭 UDP socket
    this.socket.close();
    callback();
  }

  // @ts-ignore
  _read(size) {
    // UDPStream 不需要重写 _read 方法，因为我们是通过监听 'message' 事件来处理数据接收的
  }
}

const local_addr = ref<string>("0.0.0.0");
const local_port = ref<number | null>(8080);
const remote_addr = ref<string>("192.168.1.2");
const remote_port = ref<number | null>(8080);

let udp_stream = ref<Duplex | null>(null);
let isConnected = ref(false);
function connect() {
  if (
    !toValue(local_addr) &&
    !toValue(local_port) &&
    !toValue(remote_addr) &&
    !toValue(remote_port)
  )
    return;
  disconnect();
  udp_stream.value = new UDPStream(
    toValue(local_addr),
    toValue(local_port)!,
    toValue(remote_addr),
    toValue(remote_port)!
  );
  isConnected.value = true;
}

function disconnect() {
  udp_stream.value?.destroy();
  udp_stream.value = null;
  isConnected.value = false;
}

onUnmounted(disconnect);
defineExpose({ stream: udp_stream });
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
  :deep(.el-input-group__prepend) {
    // background-color: var(--el-fill-color-blank);
    width: 120px;
    justify-content: right;
    padding-right: 10px;
  }
}
</style>
