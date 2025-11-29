import { Card } from "@/components/ui/card";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar"

import Link from 'next/link'
import { redirect } from "next/navigation";

import Header from "@/components/header";
import { getSession, isAdmin } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  const userIsAdmin = await isAdmin();

  return (
     <Card className='m-4 p-3 max-w-2xl md:mx-auto rounded-2xl '>
      <Header userName={session.name || session.email} />
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
    <Link href="/api-keys">
    <MenubarTrigger>API Keys</MenubarTrigger>
    </Link>
    {userIsAdmin && (
      <MenubarTrigger>
        Admin
        <MenubarContent>
          <Link href="/users">
            <MenubarItem>Usuários</MenubarItem>
          </Link>
          <MenubarSeparator />
          <Link href="/api-keys">
            <MenubarItem>Todas API Keys</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarTrigger>
    )}
  </MenubarMenu>
</Menubar>
        {children}
     </Card>    
  );
}
