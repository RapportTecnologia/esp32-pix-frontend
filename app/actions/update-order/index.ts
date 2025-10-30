import { prisma } from "@/app/lib/prisma"
import { OrderStatus } from "@/app/types/order"

export const updateStatus = async (paymentId: string, status: OrderStatus) => {
    await prisma.order.update({
        where: { paymentId },
        data: { status },
    })
}