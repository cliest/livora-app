import { PrismaClient } from '../../generated/client/index.js';

// Single shared Prisma instance. In dev with --watch this file can be
// re-evaluated on reload, so stash the client on globalThis to avoid
// exhausting Postgres connections.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__livoraPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error', 'warn', 'query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__livoraPrisma = prisma;
}
