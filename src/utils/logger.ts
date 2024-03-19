/* Exports */

export const log = customLogger(console.log);

export const logWarning = customLogger(console.warn);

export const logError = customLogger(console.error);

export const logSuccess = customLogger(console.log, "sgbusGreen");

/* Colors */

type Color = keyof typeof colors;

const colors = {
  // https://coolors.co/ff9900-ffc800-ffe000-fff700-b8f500-95e214-72ce27
  orangePeel: "#ff9900ff",
  mikadoYellow: "#ffc800ff",
  schoolBusYellow: "#ffe000ff",
  yellow: "#fff700ff",
  lime: "#b8f500ff",
  yellowGreen: "#95e214ff",
  sgbusGreen: "#72ce27ff",
};

/* Implementation */

type LoggerFn = (message: string, ...args: unknown[]) => void;

function customLogger(logger: typeof console.log, color?: Color): LoggerFn {
  if (color === undefined) {
    return timestampedLogger(logger);
  }
  return coloredLogger(timestampedLogger(logger), color);
}

function coloredLogger(logger: LoggerFn, color: Color): LoggerFn {
  return (message: string, ...args: unknown[]): void => {
    colorLog(logger, color, message, args);
  };
}

function colorLog(logger: LoggerFn, color: Color, message: string, ...args: unknown[]): void {
  logger(`%c${message}`, `color: ${colors[color]}`, ...args);
}

function timestampedLogger(logger: typeof console.log): LoggerFn {
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
