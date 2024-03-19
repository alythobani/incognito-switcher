export function log(...args: unknown[]): void {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}]`, ...args);
}
