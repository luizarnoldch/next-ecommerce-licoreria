'use client'

import React from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CompanyLogo from '@/assets/CompanyLogo'

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/products', label: 'Productos' },
  { path: '/about', label: 'Nosotros' },
  { path: '/contact', label: 'Contacto' },
  { path: '/blog', label: 'Blog' },
]

const BurgerNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="size-8" />
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex justify-center items-center mb-4">
            <CompanyLogo />
          </SheetTitle>
          <SheetDescription className="text-center mb-4">
            Buy everything you want
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`p-4 text-lg ${
                item.path === pathname
                  ? 'font-bold text-black'
                  : 'text-gray-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SheetFooter className="mt-auto"></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default BurgerNavigation
