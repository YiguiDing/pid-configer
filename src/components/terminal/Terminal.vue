<template>
  <div ref="xterm" />
</template>

<script setup lang="ts">
import { onMounted, ref, toValue, watch } from "vue";
import type { Duplex } from "node:stream";
import { XTerminal } from "./Terminal";
import "xterm/css/xterm.css";
import { Commander } from "@/lib/Commander";

const xterm = ref<HTMLDivElement | null>(null);
const props = defineProps<{ stream: Duplex | null; cmd: Commander | null }>();

onMounted(() => {
  let terminal = new XTerminal(toValue(xterm)!);
  let self_stream: Duplex | null = null;
  let self_cmd: Commander | null = null;
  function reveivelistener(data: Buffer) {
    let payload = data.toString("hex");
    let info = `接收 hex: ${payload}`;
    terminal!.term.writeln(info);
  }
  function writeListener(data: Buffer) {
    let payload = data.toString("hex");
    let info = `发送 hex: ${payload}`;
    terminal!.term.writeln(info);
  }
  function connectStream(stream: Duplex) {
    self_stream = stream;
    self_stream?.addListener("data", reveivelistener);
  }
  function connectCmd(cmd: Commander) {
    self_cmd = cmd;
    self_cmd?.addListener("write", writeListener);
  }
  function disconnect() {
    self_stream?.removeListener("data", reveivelistener);
    self_cmd?.removeListener("write", writeListener);
    self_stream = null;
    self_cmd = null;
  }
  watch(props, () => {
    disconnect();
    if (props.stream) connectStream(props.stream);
    if (props.cmd) connectCmd(props.cmd);
  });
});
</script>

<style lang="less"></style>
