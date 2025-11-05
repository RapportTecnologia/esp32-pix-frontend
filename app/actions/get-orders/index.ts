
import { prisma } from "@/app/lib/prisma";


export const getOrders = async () => {    
    return await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
    });
};