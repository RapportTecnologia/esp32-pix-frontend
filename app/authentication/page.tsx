
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

const Authentication = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return redirect("/dashboard");
  }
  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-6 p-5 m-auto ">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            {/* <TabsTrigger value="sign-up">Criar Conta</TabsTrigger> */}
          </TabsList>
          <TabsContent value="sign-in">
            <SignIn />
          </TabsContent>  
          <TabsContent value="sign-up">
            <SignUp />   
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;