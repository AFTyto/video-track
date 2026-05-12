import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

const neonConn = neon(process.env.DATABASE_URL || "");

export const conn = (strings: TemplateStringsArray, ...values: any[]) => {
  return neonConn(strings, ...values);
};
