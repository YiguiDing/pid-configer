import { Connection } from "./connection";
import type { SerialPort as ISerialPort } from "serialport";
// @ts-ignore
import type { PortInfo } from "@serialport/bindings-interface";
const SerialPort = require("serialport").SerialPort as typeof ISerialPort;

export class SerialPortConnection extends Connection {
  name = "SerialPort";
  //   ######################################################
  paths = new Array<PortInfo>();
  async list() {
    this.paths = await SerialPort.list();
  }
  path: string = "COM1";
  setPath(path: string) {
    this.path = path;
    this.reconnect();
  }
  //   ######################################################
  baudRates = [300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
  baudRate: number = 115200;
  setBaudRate(baudRate: number) {
    this.baudRate = baudRate;
    this.reconnect();
  }
  //   ######################################################
  port: ISerialPort | null = null;
  connect() {
    if (this.port) return;
    this.port = new SerialPort({
      path: this.path,
      baudRate: this.baudRate,
    });
    this.port.on("data", (data) => this.onReceive(data));
  }
  disonnect() {
    this.port?.close();
    this.port?.destroy();
    this.port = null;
  }
  reconnect() {
    if (this.isConnect()) {
      this.disonnect();
      this.connect();
    }
  }
  isConnect() {
    return this.port != null;
  }
  //   ######################################################
  send(data: Buffer) {
    this.port?.write(data);
    super.send(data);
  }
}
