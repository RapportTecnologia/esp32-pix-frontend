
export type OrderStatus = "PENDING" | "APPROVED" | "CANCELLED";
export interface Order {
    amount: number;
    status: OrderStatus;
    id: string;
    paymentId: string;
    description?: string;
    qrCode: string | null;
    qrCodeBase64: string | null;
    paymentUrl: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
}

export interface CreateOrderBody {
  amount: number;
  description?: string;
  payerEmail?: string;
}