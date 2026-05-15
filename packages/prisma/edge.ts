import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

let _prismaEdge: PrismaClient | null = null;

function getPrismaEdge() {
  if (!_prismaEdge) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);
    _prismaEdge = new PrismaClient({ adapter });
  }
  return _prismaEdge;
}

// Re-export with lazy getters to prevent build-time initialization
export const prismaEdge = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getPrismaEdge(), prop);
  },
});
