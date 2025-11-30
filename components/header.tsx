"use client"
import { Coffee, LogOut, User } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { logoutAction } from '@/app/actions/auth'

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName }: HeaderProps) => {
  return (
    <div className='flex justify-between items-center mb-3'>
      <div className="text-2xl flex justify-center items-center gap-2">
        <div className="flex flex-col leading-tight">
          <span>Café Expresso</span>
          <span className="text-xs text-muted-foreground">Sistemas de Cobrança Embarcada</span>
        </div>
        <Coffee />
      </div>
      {userName && (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            {userName}
          </span>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit" title="Sair">
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Header