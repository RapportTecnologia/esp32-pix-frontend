"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Microchip, LogIn, Loader2 } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await loginAction(formData);
      if (!result.success) {
        toast.error(result.error || "Erro ao fazer login");
      }
      // Se sucesso, o redirect é feito no server action
    } catch {
      // Redirect acontece aqui
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-3xl font-bold mb-2">
            <Microchip className="w-8 h-8" />
            ESP-PIX
          </div>
          <p className="text-muted-foreground text-sm">
            Faça login para acessar o painel
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
