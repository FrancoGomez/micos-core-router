import { PrismaClient } from '@prisma/client';

// Evita múltiples instancias en desarrollo debido al Hot Reload de Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;