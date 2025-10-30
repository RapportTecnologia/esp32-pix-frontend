export const revalidate = 0;
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftRight } from 'lucide-react'
import React from 'react'
import TableOrders from './components/tableOrders'
import { getOrders } from '@/app/actions/get-orders'

const Order = async () => {
  const orders = await getOrders();
  return (
    <CardHeader className='p-0'>
        <CardTitle className='flex items-center gap-2 text-xl'><ArrowLeftRight /> Pedidos</CardTitle>
        <TableOrders orders={orders} />
    </CardHeader>
  )
}

export default Order