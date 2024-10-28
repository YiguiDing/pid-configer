import { Connection } from "./connection";
import net, { Socket } from "node:net";
import { isValidPort } from "./utils";
import ip from "ip";

export class TCPClientConnection extends Connection {
  name = "TCPClient";
  //   ######################################################
  host = "192.168.1.1";
  setHost(host: string) {
    this.host = host;
    if (ip.isV4Format(this.host)) this.reconnect();
  }
  //   ######################################################
  port = 8080;
  setPort(port: number) {
    this.port = port;
    if (isValidPort(this.port)) this.reconnect();
  }
  //   ######################################################
  socket: Socket | null = null;
  connect() {
    if (this.socket) return;
    if (!ip.isV4Format(this.host) || !isValidPort(this.port)) return;
    this.socket = net.createConnection({
      host: this.host,
      port: this.port,
    });
    this.socket.on("data", (data) => this.onReceive(data));
  }
  disonnect() {
    this.socket?.destroy();
    this.socket = null;
  }
  //   ######################################################
  reconnect() {
    if (this.isConnect()) {
      this.disonnect();
      this.connect();
    }
  }
  isConnect() {
    return this.socket != null;
  }
  //   ######################################################
  send(data: Buffer) {
    this.socket?.write(data);
    super.send(data);
  }
}
