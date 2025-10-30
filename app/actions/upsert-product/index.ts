"use server";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/lib/next-safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import z from "zod";

const inputSchema = z.object({
    id: z.string().optional(),
    amount: z.number({ message: "Campo obrigatório" }),
    description: z.string().min(0).optional(),
    quantity: z.number({ message: "Campo obrigatório" }).optional(),
    payerEmail: z.string().optional(),
});

export const createOrUpdateProduct = actionClient
  .inputSchema(inputSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id, amount, description, quantity, payerEmail } }) => {
    const product = await prisma.product.upsert({
      where: { id: id ?? "" },
      create: {
        amount,
        description,
        quantity,
        payerEmail,
      },
      update: {
        amount,
        description,
        quantity,
        payerEmail,
      },
    });

    revalidatePath("/product");
    return product;
  });