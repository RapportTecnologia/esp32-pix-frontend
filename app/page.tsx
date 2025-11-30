"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'




const Home = () => {
  const router = useRouter();
  return ( 
       <main className="flex flex-col min-h-screen ">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-background to-slate-50">
        <h1 className="text-5xl font-bold text-foreground mb-4 max-w-3xl">
          Cobrança automática via PIX para qualquer equipamento autônomo
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          Plataforma de pagamentos PIX embarcada em ESP32 para automatizar a liberação de serviços em vending machines,
          lavanderias automáticas, portões, cancelas e qualquer outro equipamento que precise cobrar antes de funcionar.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-secondary hover:text-700 transition"
          >
            Acessar dashboard de demonstração
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            O que o sistema faz
          </h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto mb-10">
            Nosso sistema conecta seu equipamento ao PIX: o cliente faz o pagamento, o ESP32 valida o comprovante
            e o equipamento é liberado automaticamente pelo tempo ou quantidade configurada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Integração embarcada</h3>
              <p className="text-gray-600">
                Rodando diretamente no ESP32, sem precisar de computador local. Ideal para pontos remotos e
                dispositivos autônomos.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">PIX como meio de pagamento</h3>
              <p className="text-gray-600">
                Receba via PIX e automatize a liberação do serviço, reduzindo fraude, custo operacional e necessidade
                de atendimento humano.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Gestão em tempo real</h3>
              <p className="text-gray-600">
                Acompanhe transações, status dos equipamentos e métricas de uso diretamente no dashboard web.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Onde usar o sistema de cobrança via PIX
          </h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto mb-10">
            Alguns exemplos de aplicações típicas que podem ser controladas por tempo, ciclos de uso ou quantidade
            entregue ao cliente após o pagamento via PIX:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="p-4 border rounded-lg bg-white">Vending machines e máquinas de snacks</div>
            <div className="p-4 border rounded-lg bg-white">Lavanderias automáticas (lavagem e secagem de roupas)</div>
            <div className="p-4 border rounded-lg bg-white">Portões e cancelas de acesso</div>
            <div className="p-4 border rounded-lg bg-white">Abastecimento de água filtrada</div>
            <div className="p-4 border rounded-lg bg-white">Carregadores USB públicos</div>
            <div className="p-4 border rounded-lg bg-white">Enchimento de pneus em postos e estacionamentos</div>
            <div className="p-4 border rounded-lg bg-white">Duchas de praia e lava-pés</div>
            <div className="p-4 border rounded-lg bg-white">Lavagem automática de veículos</div>
            <div className="p-4 border rounded-lg bg-white">Escritórios de coworking públicos (acesso temporário)</div>
            <div className="p-4 border rounded-lg bg-white">Recarga de créditos de cartões de ônibus</div>
            <div className="p-4 border rounded-lg bg-white">Boxes de bagagens e armários inteligentes</div>
            <div className="p-4 border rounded-lg bg-white">Geladeiras rápidas em áreas públicas</div>
            <div className="p-4 border rounded-lg bg-white">Sistemas de secagem de roupas, toalhas e cangas na praia</div>
            <div className="p-4 border rounded-lg bg-white">Impressoras públicas e totens de impressão</div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home