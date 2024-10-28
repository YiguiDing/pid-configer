import { EventEmitter } from "node:events";

export class Connection extends EventEmitter<{
  send: [Buffer];
  data: [Buffer];
}> {
  public send(data: Buffer) {
    this.emit("send", data);
  }
  protected onReceive(data: Buffer) {
    this.emit("data", data);
  }
}
