import { neon, neonConfig } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql) {
    neonConfig.fetchConnectionCache = true;
    _sql = neon(process.env.DATABASE_URL || "");
  }
  return _sql;
}

const neonQuery = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values);
};

neonQuery.execute = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await getSql()(strings, ...values);
  return { rows: result };
};

export const conn = neonQuery;
