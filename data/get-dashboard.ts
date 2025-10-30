import { prisma } from "@/app/lib/prisma";

export const getDashboard = async () => {
   const [ totalRevenue, totalOrders] 
   = await Promise.all([
    prisma.order.aggregate({ // total revenue
        _sum: {
            amount: true,
        },
        where: {
            status: "APPROVED",
        },
    }),

    prisma.order.count({ // total orders
    }),

   ]);

   return { totalRevenue, totalOrders, };
};