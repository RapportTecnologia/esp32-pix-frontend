import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";

export const getOrders = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    
    return await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
    });
};