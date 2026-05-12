import { conn } from "./connection";

export const checkIfUserExists = async (userId: string) => {
  const rows = (await conn`SELECT 1 FROM "User" WHERE id = ${userId} LIMIT 1`) as { "1": number }[];

  return rows && Array.isArray(rows) && rows.length > 0;
};
