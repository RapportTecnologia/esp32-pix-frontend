"use server";

import { prisma } from "@/app/lib/prisma";
import { login, logout, getSession, generateApiKey, isAdmin } from "@/lib/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Login action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email e senha são obrigatórios" };
  }

  const result = await login(email, password);
  
  if (result.success) {
    redirect("/dashboard");
  }
  
  return result;
}

// Logout action
export async function logoutAction() {
  await logout();
  redirect("/login");
}

// Criar usuário (apenas admin)
export async function createUserAction(formData: FormData) {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: "Acesso negado" };
  }

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "user";

  if (!email || !password) {
    return { success: false, error: "Email e senha são obrigatórios" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "Este email já está em uso" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/users");
  return { success: true };
}

// Deletar usuário (apenas admin)
export async function deleteUserAction(userId: string) {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: "Acesso negado" };
  }

  const session = await getSession();
  if (session?.id === userId) {
    return { success: false, error: "Você não pode deletar seu próprio usuário" };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/users");
  return { success: true };
}

// Listar usuários (apenas admin)
export async function listUsersAction() {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: "Acesso negado", users: [] };
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, users };
}

// Criar API Key
export async function createApiKeyAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Não autenticado" };
  }

  const name = formData.get("name") as string;
  const expiresIn = formData.get("expiresIn") as string;

  if (!name) {
    return { success: false, error: "Nome é obrigatório" };
  }

  let expiresAt: Date | null = null;
  if (expiresIn && expiresIn !== "never") {
    const days = parseInt(expiresIn);
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  const key = generateApiKey();

  await prisma.apiKey.create({
    data: {
      name,
      key,
      userId: session.id,
      expiresAt,
    },
  });

  revalidatePath("/api-keys");
  
  // Retorna a key apenas uma vez (depois não será mais visível)
  return { success: true, key };
}

// Deletar API Key
export async function deleteApiKeyAction(keyId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Não autenticado" };
  }

  const admin = await isAdmin();
  
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: keyId },
  });

  if (!apiKey) {
    return { success: false, error: "API Key não encontrada" };
  }

  // Apenas o dono ou admin pode deletar
  if (apiKey.userId !== session.id && !admin) {
    return { success: false, error: "Acesso negado" };
  }

  await prisma.apiKey.delete({
    where: { id: keyId },
  });

  revalidatePath("/api-keys");
  return { success: true };
}

// Revogar/Ativar API Key
export async function toggleApiKeyAction(keyId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Não autenticado" };
  }

  const admin = await isAdmin();
  
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: keyId },
  });

  if (!apiKey) {
    return { success: false, error: "API Key não encontrada" };
  }

  if (apiKey.userId !== session.id && !admin) {
    return { success: false, error: "Acesso negado" };
  }

  await prisma.apiKey.update({
    where: { id: keyId },
    data: { isActive: !apiKey.isActive },
  });

  revalidatePath("/api-keys");
  return { success: true };
}

// Listar API Keys do usuário
export async function listApiKeysAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Não autenticado", apiKeys: [] };
  }

  const admin = await isAdmin();

  const apiKeys = await prisma.apiKey.findMany({
    where: admin ? {} : { userId: session.id },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    apiKeys: apiKeys.map((k) => ({
      id: k.id,
      name: k.name,
      keyPreview: `${k.key.slice(0, 8)}...${k.key.slice(-4)}`,
      isActive: k.isActive,
      lastUsedAt: k.lastUsedAt,
      expiresAt: k.expiresAt,
      createdAt: k.createdAt,
      user: k.user,
    })),
  };
}
