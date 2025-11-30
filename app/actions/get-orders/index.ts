import { prisma } from "@/app/lib/prisma";
import { Order } from "@/app/types/order";


export const getOrders = async (): Promise<Order[]> => {    
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
    });
    
    return orders.map(order => ({
        ...order,
        status: order.status as Order["status"]
    }));
};