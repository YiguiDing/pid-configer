import { SimpleProtocalParser } from "./simple-protocal";
import { Dragram } from "./type/Dragram";
import { Duplex } from "node:stream";
import { EventEmitter } from "node:events";

export class Commander extends EventEmitter<{
  write: [Buffer];
  data: [Buffer];
}> {
  private ioStream: Duplex | null = null;
  private dragram: Dragram | null = null;
  private protocal = new SimpleProtocalParser();
  private CMD = Object.freeze({
    SetKp: 1,
    SetKi: 2,
    SetKd: 3,
    SetOutputLimit: 4,
    SetOutputROC: 5,
    SetTarget: 6,
    DrawDragram: 7,
  });
  littleEndin = true;
  listener: any;
  public connectStream(ioStream: Duplex | null) {
    if (!this.listener) this.listener = this.onData.bind(this);
    this.ioStream?.removeListener("data", this.listener);
    this.ioStream = ioStream;
    this.ioStream?.on("data", this.listener);
  }

  public connectDragram(dragram: Dragram | null) {
    this.dragram = dragram;
  }

  private send(data: number[] | Buffer) {
    let frame = this.protocal.encoder(data);
    let buffer = Buffer.from(frame);
    if (this.ioStream) {
      this.emit("write", buffer);
      this.ioStream.write(buffer);
    }
  }

  private onData(chunk: Buffer) {
    for (let byte of chunk) {
      let data = this.protocal.decoder(byte);
      if (data) this.process(data);
    }
  }

  private process(data: number[]) {
    const cmd = data[0];
    const args = Buffer.from(data.slice(1));
    switch (cmd) {
      case this.CMD.SetKp:
        this.handleSetKp(args);
        break;
      case this.CMD.SetKi:
        this.handleSetKi(args);
        break;
      case this.CMD.SetKd:
        this.handleSetKd(args);
        break;
      case this.CMD.SetOutputLimit:
        this.handleSetOutputLimit(args);
        break;
      case this.CMD.SetOutputROC:
        this.handleSetOutputROC(args);
        break;
      case this.CMD.SetTarget:
        this.handleSetTarget(args);
        break;
      case this.CMD.DrawDragram:
        this.handleDrawDragram(args);
        break;
      default:
        console.warn("Unknown command code:", cmd);
    }
  }
  public setKp(ch: number, Kp: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetKp);
    view.setUint8(1, ch);
    view.setFloat32(2, Kp, this.littleEndin);
    this.send(buffer);
  }
  public handleSetKp(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let kp = view.getFloat32(1, this.littleEndin);
    console.log("handleSetKp", ch, kp);
  }
  public setKi(ch: number, Ki: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetKi);
    view.setUint8(1, ch);
    view.setFloat32(2, Ki, this.littleEndin);
    this.send(buffer);
  }
  public handleSetKi(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let ki = view.getFloat32(1, this.littleEndin);
    console.log("handleSetKi", ch, ki);
  }
  public setKd(ch: number, Ki: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetKd);
    view.setUint8(1, ch);
    view.setFloat32(2, Ki, this.littleEndin);
    this.send(buffer);
  }
  public handleSetKd(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let kd = view.getFloat32(1, this.littleEndin);
    console.log("handleSetKd", ch, kd);
  }
  public setOutputLimit(ch: number, limit: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetOutputLimit);
    view.setUint8(1, ch);
    view.setFloat32(2, limit, this.littleEndin);
    this.send(buffer);
  }
  public handleSetOutputLimit(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let outputLimit = view.getFloat32(1, this.littleEndin);
    console.log("handleSetOutputLimit", ch, outputLimit);
  }
  public setOutputROC(ch: number, outputROC: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetOutputROC);
    view.setUint8(1, ch);
    view.setFloat32(2, outputROC, this.littleEndin);
    this.send(buffer);
  }
  public handleSetOutputROC(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let outputROC = view.getFloat32(1, this.littleEndin);
    console.log("handleSetOutputROC", ch, outputROC);
  }
  public setTarget(ch: number, target: number) {
    let buffer = Buffer.alloc(6);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.SetTarget);
    view.setUint8(1, ch);
    view.setFloat32(2, target, this.littleEndin);
    this.send(buffer);
  }
  public handleSetTarget(buffer: Buffer) {
    if (buffer.length < 5) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let target = view.getFloat32(1, this.littleEndin);
    console.log("handleSetTarget", ch, target);
  }
  public DrawDragram(ch: number, target: number, curent: number) {
    let buffer = Buffer.alloc(10);
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    view.setUint8(0, this.CMD.DrawDragram);
    view.setUint8(1, ch);
    view.setFloat32(2, target, this.littleEndin);
    view.setFloat32(6, curent, this.littleEndin);
    this.send(buffer);
  }
  private handleDrawDragram(buffer: Buffer) {
    if (buffer.length < 9) return;
    let view = new DataView(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    let ch = view.getUint8(0);
    let target = view.getFloat32(1, this.littleEndin);
    let curent = view.getFloat32(5, this.littleEndin);
    // console.log("handleDrawDragram:", ch, target, curent);
    this.dragram?.draw(ch, target, curent);
  }
}
