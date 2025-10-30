
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const }, // ✅ agora credentials funcionam
  secret: process.env.NEXTAUTH_SECRET,
};


