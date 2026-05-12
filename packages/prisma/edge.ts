import { neon, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL || "");
const adapter = new PrismaNeon(sql);

export const prismaEdge = new PrismaClient({
  adapter,
});
