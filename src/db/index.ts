import { PrismaClient } from "@prisma/client";

// Do not create multiple instances of PrismaClient in production.
// In Development environment, you can create multiple instances of PrismaClient, but in production, you should create a single instance and reuse it to make the application more efficient.
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
