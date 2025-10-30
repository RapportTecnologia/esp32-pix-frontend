
import { prisma } from "@/app/lib/prisma";


export const getProductId = async (id: string) => {
    return await prisma.product.findUnique({ where: { id } });
}

export const getProducts = async () => {
    return await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });
}