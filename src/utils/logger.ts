/* Exports */

export const log = makeLogger(console.log);

export const logWarning = makeLogger(console.warn);

export const logError = makeLogger(console.error);

/* Implementation */

type LoggerFn = (message: string, ...args: unknown[]) => void;

function makeLogger(logger: typeof console.log): LoggerFn {
  return (message: string, ...args: unknown[]): void => {
    logWithTimestamp(logger, message, ...args);
  };
}

const logWithTimestamp = (
  logger: typeof console.log,
  message: string,
  ...args: unknown[]
): void => {
  const timestamp = new Date().toLocaleString();
  logger(`[${timestamp}]\n${message}`, ...args);
};
