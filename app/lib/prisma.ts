import { PrismaClient } from "@prisma/client";

const isDevelopment = process.env.NODE_ENV === "development";

// Singleton pattern para evitar múltiplas instâncias em desenvolvimento (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ["warn", "error"] : ["error"],
  });

if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

