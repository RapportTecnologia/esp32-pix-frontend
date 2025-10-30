"use server";

import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { act } from "react";
import z from "zod";

export const deleteProduct = actionClient
    .inputSchema(z.object({ id: z.string() }))
    .action(async ({ parsedInput: { id } }) => {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new Error("Product not found");
        }
        await prisma.product.delete({ where: { id } });
        revalidatePath("/product");
    })