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

// Narrow catches to the Prisma errors a route actually expects, so a real
// fault (database down, bad query) still reaches the central error handler
// as a 500 instead of being reported to the client as "not found".
export const isNotFoundError = (err) => err?.code === 'P2025';
export const isForeignKeyError = (err) => err?.code === 'P2003';
