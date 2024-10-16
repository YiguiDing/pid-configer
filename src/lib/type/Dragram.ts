export interface Dragram {
  draw(channel: number, target: number, output: number): void;
  sync(channel: number, kp: number, ki: number, kd: number,limit:number,ramp:number): void;
}
