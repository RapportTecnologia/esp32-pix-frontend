import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";

/**
 * Endpoint para validar API Key
 * Usado pelo firmware ESP32 para verificar se a key é válida
 * 
 * POST /api/auth/validate-key
 * Headers: x-api-key: esp_xxx...
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      { valid: false, error: "API Key não fornecida" },
      { status: 401 }
    );
  }

  const keyData = await validateApiKey(apiKey);

  if (!keyData) {
    return NextResponse.json(
      { valid: false, error: "API Key inválida ou expirada" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    valid: true,
    name: keyData.name,
    userId: keyData.userId,
  });
}
