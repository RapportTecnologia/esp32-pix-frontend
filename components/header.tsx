"use client"
import { Microchip, Power } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
  
  const handleSignOut = () => {
    signOut()
    redirect('/authentication')
  }

  return (
    <div className='flex justify-around items-center'>
    <div className="text-2xl flex justify-center items-center gap-2">ESP - PIX <Microchip /></div>
    <Button onClick={handleSignOut} variant={'ghost'} title='Sair' className='cursor-pointer'>Sair
    <Power />
    </Button>
    </div>
  )
}

export default Header