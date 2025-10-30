
import React from 'react'
import { getProducts } from '@/app/actions/get-product';
import { createProductType } from '@/app/types/product';
import { CardHeader, CardTitle } from '@/components/ui/card';
import Product from './components/product';
import { LayoutList } from 'lucide-react';



const page = async () => {

  const products: createProductType[] = await getProducts();
    
  return (
    <>
      <CardHeader className='p-0'>
        <CardTitle className='flex items-center gap-2 text-xl'><LayoutList /> Produtos</CardTitle>
      </CardHeader>
        <Product products={products} />
    </>
  )
}

export default page