import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "esp_pix_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Tipos
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// Garante que o admin master existe
export async function ensureAdminExists() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env");
    return null;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  // Criar admin master
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Administrador",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Usuário admin master criado:", adminEmail);
  return admin;
}

// Login
export async function login(email: string, password: string) {
  // Garantir que admin existe
  await ensureAdminExists();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: "Usuário não encontrado" };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { success: false, error: "Senha incorreta" };
  }

  // Criar sessão
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  // Definir cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

// Logout
export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { sessionToken },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Obter sessão atual
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    // Sessão expirada
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

// Verificar se é admin
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}

// Gerar API Key
export function generateApiKey(): string {
  return `esp_${crypto.randomBytes(24).toString("hex")}`;
}

// Validar API Key (para uso nas rotas da API)
export async function validateApiKey(apiKey: string) {
  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true },
  });

  if (!key || !key.isActive) {
    return null;
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    return null;
  }

  // Atualizar último uso
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    id: key.id,
    name: key.name,
    userId: key.userId,
    user: key.user,
  };
}
