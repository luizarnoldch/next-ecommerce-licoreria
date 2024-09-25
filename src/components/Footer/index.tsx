'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

// Icons
import CompanyLogo from '@/assets/CompanyLogo'
import { FaFacebookF, FaXTwitter, FaCopyright } from "react-icons/fa6"
import { RiInstagramFill } from "react-icons/ri"

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/products', label: 'Productos' },
  { path: '/about', label: 'Nosotros' },
  { path: '/contact', label: 'Contacto' },
  { path: '/blog', label: 'Blog' },
]

type FooterProps = {}

const Footer: React.FC<FooterProps> = ({ }) => {
  const pathname = usePathname()
  return (
    <footer className='w-full bg-[#6AA392] py-8'>
      <div className='container mx-auto flex justify-between px-4 gap-12'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <CompanyLogo className='fill-white' />
          <p>Siguenos en nuestras redes Sociales</p>
          <div className='flex justify-start items-center gap-4'>
            <div className='size-8 rounded-full ring-1 ring-white flex justify-center items-center'>
              <Link href={"/"}>
                <FaFacebookF className='fill-white' />
              </Link>
            </div>
            <div className='size-8 rounded-full ring-1 ring-white flex justify-center items-center'>
              <Link href={"/"}>
                <RiInstagramFill className='fill-white' />
              </Link>
            </div>
            <div className='size-8 rounded-full ring-1 ring-white flex justify-center items-center'>
              <Link href={"/"}>
                <FaXTwitter className='fill-white' />
              </Link>
            </div>
          </div>
          <span className='flex gap-2 justify-center items-center mt-10'>
            <FaCopyright className='fill-white size-6' />
            2023 Todos los derechos reservados
          </span>
        </div>
        <div>
          <nav className="flex flex-col x justify-between items-center text-white/50">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full p-2 text-center  ${item.path === pathname ? 'font-bold text-white' : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer