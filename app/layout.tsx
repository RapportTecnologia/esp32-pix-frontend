import type { Metadata } from "next";
import { Orbitron } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESP-32 PIX",
  description: "API para pagamento com PIX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${orbitron.className} antialiased dark`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
        <footer className="flex flex-col px-3 w-full text-center items-center mt-4 text-sm py-3.5 gap-1 text-muted-foreground border-t border-border">
          <div>© {new Date().getFullYear()} ESP-32 PIX - Todos os direitos reservados</div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <span>Projeto original: <a href="https://github.com/mazinhoandrade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MazinhoDev</a></span>
            <span>Mantenedor: <a href="https://carlosdelfino.eti.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Carlos Delfino</a></span>
          </div>
        </footer>
      </body>
    </html>
  );
}
