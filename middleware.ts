import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas (não requerem login)
const publicRoutes = ["/", "/login", "/api/webhook", "/api/ping", "/api/auth/validate-key"];

// Rotas que requerem apenas API key (para firmware ESP32)
const apiKeyRoutes = ["/api/create_payment", "/api/status"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é rota pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Verificar se é rota de API key (firmware)
  const isApiKeyRoute = apiKeyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Para rotas de API key, verificamos o header x-api-key no endpoint
  if (isApiKeyRoute) {
    // A validação da API key é feita na própria rota
    return NextResponse.next();
  }

  // Rotas públicas passam direto
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para rotas protegidas, verificar cookie de sessão
  const sessionCookie = request.cookies.get("esp_pix_session");

  if (!sessionCookie) {
    // Redirecionar para login se não autenticado
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sessão existe, permitir acesso
  // A validação completa da sessão é feita no servidor
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
