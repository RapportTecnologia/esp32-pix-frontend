// app/api/webhook/route.ts
import { updateStatus } from "@/app/actions/update-order";
import mpClient, { verifyMercadoPagoSignature } from "@/app/lib/mercado-pago";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    verifyMercadoPagoSignature(req);

    // Parse the request body
    const body = await req.json();
    // Extract the event type and data
    const { type, data } = body;
  
  switch (type) {
      case "payment":
        const payment = mpClient.payment; 
        const paymentData = await payment.get({ id: data.id });
        if (
          paymentData.status === "approved" || // Pagamento por cartão OU
          paymentData.date_approved !== null // Pagamento por Pix
        ) {
           // Atualizar status no banco
          await updateStatus(data.id.toString(), "APPROVED");
        } else if (
          paymentData.status === "cancelled" ||
          paymentData.status === "expired"
        ) {
          // Pagamento cancelado ou expirado
          await updateStatus(data.id.toString(), "CANCELLED");
        } 
        break;
          default:
            console.log("Unhandled event type:", type);
        }

  return NextResponse.json({ status: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  } 
}
