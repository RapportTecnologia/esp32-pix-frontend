import { CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge } from 'lucide-react'
import React from 'react'
import CardDashboard from './_components/cardDashboard'
import { getDashboard } from '@/data/get-dashboard'

const Dashboard = async ()  => {
  const { totalRevenue, totalOrders } = await getDashboard();

  return (
      <CardHeader className='p-0'>
        <CardTitle className='flex items-center gap-2 text-xl'><Gauge /> Dashboard</CardTitle>
        <CardDashboard 
          totalRevenue={totalRevenue._sum.amount ? Number(totalRevenue._sum.amount) : 0 } 
          totalOrders={totalOrders}
        />
      </CardHeader>
  )
}

export default Dashboard