export function isValidPort(port: number) {
  return 0 <= port && port <= 65535;
}
