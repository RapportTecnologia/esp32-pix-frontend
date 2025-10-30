import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Order } from '@/app/types/order'
import { formatCentsToBRL } from '@/app/helpers/money'
interface Props {
    orders:Order[]
}
const TableOrders = ({orders}:Props) => {
  return (
    <Table>
  <TableCaption>Uma lista de pedidos realizados :)</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">PagamentoId</TableHead>
      <TableHead>Valor</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Descrição</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
   {orders.map((order) => (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.paymentId}</TableCell>
      <TableCell>{formatCentsToBRL(order.amount)}</TableCell>
      <TableCell>{order.status}</TableCell>
      <TableCell className="text-right">{order.description}</TableCell>
    </TableRow>
   ))}
  </TableBody>
</Table>
  )
}

export default TableOrders