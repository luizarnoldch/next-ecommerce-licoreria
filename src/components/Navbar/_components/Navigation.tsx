'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/products', label: 'Productos' },
  { path: '/about', label: 'Nosotros' },
  // { path: '/contact', label: 'Contacto' },
  // { path: '/blog', label: 'Blog' },
]

type Props = {}

const Navigation = (props: Props) => {
  const pathname = usePathname()
  return (
    <nav className="flex justify-between items-center">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`p-4  ${
            item.path === pathname ? 'font-bold text-black' : 'text-gray-500 '
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
