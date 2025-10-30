"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'




const Home = () => {
  const router = useRouter();
  return ( 
       <main className="flex flex-col min-h-screen ">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">ESP32-PIX IoT Projects</h1>
        <p className="text-lg text-gray-700 max-w-xl">
          Conecte seu ESP32 à internet, controle dispositivos remotamente e explore o mundo IoT com facilidade.
        </p>
        <Button onClick={() => router.push("/authentication")} className="mt-8 bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-secondary hover:text-700 transition">
          Fazer Login
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
          <div className="text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Conectividade Wi-Fi</h3>
            <p className="text-gray-600">
              Configure seu ESP32 facilmente e conecte seus dispositivos à rede sem fio.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Controle Remoto</h3>
            <p className="text-gray-600">
              Ligue e desligue dispositivos de qualquer lugar com apps ou dashboards web.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Monitoramento em Tempo Real</h3>
            <p className="text-gray-600">
              Receba dados do seu ESP32 em tempo real, como temperatura, umidade e muito mais.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home