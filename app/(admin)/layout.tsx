import { Card } from "@/components/ui/card";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { getServerSession } from "next-auth/next";
import Link from 'next/link'
import { redirect } from "next/navigation";
import Header from "@/components/header";
import { authOptions } from "../lib/auth";

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return redirect("/authentication");
    }
  return (
     <Card className='m-4 p-3 max-w-2xl md:mx-auto rounded-2xl '>
      <Header />
    <Menubar className="bg-primary">
  <MenubarMenu>
    <Link href="/dashboard">
    <MenubarTrigger>Dashboard</MenubarTrigger>
    </Link>
    <Link href="/product">
    <MenubarTrigger>Produtos</MenubarTrigger>
    </Link>
    <Link href="/order">
    <MenubarTrigger>Pedidos</MenubarTrigger>
    </Link>
  </MenubarMenu>
</Menubar>
        {children}
     </Card>    
  );
}
