// Axiom logging disabled for VideoTrack - using simple console logging
export const logger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  log: (...args: any[]) => console.log(...args),
  flush: async () => {},
};

export const withAxiomBodyLog = (handler: any) => handler;
export const withAxiom = (handler: any) => handler;