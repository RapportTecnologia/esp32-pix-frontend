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
        <div className="flex px-3 w-full text-center justify-center mt-4 text-sm py-3.5">@{new Date().getFullYear()} - ESP-32 PIX - Todos os direitos reservados - MazinhoDev</div>
      </body>
    </html>
  );
}
