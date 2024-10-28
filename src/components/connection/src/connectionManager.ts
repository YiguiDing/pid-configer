import { SerialPortConnection } from "./SerialPort";
import { TCPClientConnection } from "./TCPClient";

export class ConnectionManager {
  key: string = "";
  connections = {
    SerialPort: new SerialPortConnection(),
    TCPClient: new TCPClientConnection(),
  };
  activeName = "SerialPort";
  active(key: string) {
    this.key = key;
  }
  getActived() {
    return this.connections[this.key];
  }
}
