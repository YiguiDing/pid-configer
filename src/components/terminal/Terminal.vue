<template>
  <div ref="xterm" />
</template>

<script setup lang="ts">
import { onMounted, ref, toValue, watch, watchEffect } from "vue";
import type { Duplex } from "node:stream";
import { XTerminal } from "./Terminal";
import "xterm/css/xterm.css";

const xterm = ref<HTMLDivElement | null>(null);
const props = defineProps<{ stream: Duplex | null }>();

onMounted(() => {
  let terminal = new XTerminal(toValue(xterm)!);
  let self_stream: Duplex | null = null;
  // let originalWrite: any = () => {};
  function listenerReveive(data: Buffer) {
    console.log("listenerReveive");
    let payload = data.toString("hex");
    let info = `发送 hex: ${payload}`;
    terminal!.term.writeln(info);
  }
  // function listenerSend(data: Buffer) {
  //   let payload = data.toString("hex");
  //   let info = `发送 hex: ${payload}`;
  //   terminal!.term.writeln(info);
  // }
  function connect(stream: Duplex) {
    self_stream = stream;
    self_stream?.addListener("data", listenerReveive);
    // originalWrite = self_stream._write;
    // self_stream._write = function (...args) {
    // console.log(originalWrite);
    // originalWrite.apply(self_stream, args);
    // self_stream?.emit("send", args[0]);
    // };
    // self_stream?.addListener("send", listenerSend);
  }
  function disconnect() {
    if (!self_stream) return;
    self_stream.removeListener("data", listenerReveive);
    // if (self_stream) self_stream._write = originalWrite;
    // self_stream.removeListener("send", listenerSend);
    self_stream = null;
  }
  watch(props, () => {
    disconnect();
    if (props.stream) connect(props.stream);
  });
});
</script>

<style lang="less"></style>
