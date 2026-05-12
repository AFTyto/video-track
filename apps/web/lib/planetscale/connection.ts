import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL || "");

const neonQuery = (strings: TemplateStringsArray, ...values: any[]) => {
  return sql(strings, ...values);
};

neonQuery.execute = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await sql(strings, ...values);
  return { rows: result };
};

export const conn = neonQuery;
