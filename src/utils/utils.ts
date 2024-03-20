export function convertToCallback<PromiseFunction extends (...args: any[]) => Promise<void>>(
  promiseFunction: PromiseFunction
): (...args: Parameters<PromiseFunction>) => void {
  return (...args) => {
    void promiseFunction(...args);
  };
}

export function isURL(text: string): boolean {
  let url;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    url = new URL(text);
  } catch (e) {
    return false;
  }
  return true;
}

export function throwExpectedNeverError(value: never): never {
  throw new Error("Expected never, instead got: " + JSON.stringify(value));
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
