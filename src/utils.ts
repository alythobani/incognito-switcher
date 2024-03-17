export function convertToForgettableCallback<
  PromiseFunction extends (...args: any[]) => Promise<void>
>(promiseFunction: PromiseFunction): (...args: Parameters<PromiseFunction>) => void {
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

export function isInvalidChromeUrl(url: string): boolean {
  return url.startsWith("chrome://") && !url.startsWith("chrome://newtab/");
}

export function throwExpectedNeverError(value: never): never {
  throw new Error("Expected never, instead got: " + JSON.stringify(value));
}
