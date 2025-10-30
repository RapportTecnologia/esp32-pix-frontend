// app/api/status/[paymentId]/route.ts

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ paymentId: string }> }) {
  // ⚠️ await antes de usar
  const params = await context.params;
  const paymentId = String(params.paymentId);

  const order = await prisma.order.findUnique({
    where: { paymentId },
    select: { id: true, status: true, paymentId: true},
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  return NextResponse.json(order);
}
