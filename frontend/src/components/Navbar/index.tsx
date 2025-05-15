// components/Navbar.tsx
"use client";

import dynamic from 'next/dynamic'

import Link from "next/link";
import React from "react";
import SearchInput from "./SearchInput";
import AccountButton from "./AccountButton";
import CartButton from "./CartButton";
import CompanyLogo from "@/assets/CompanyLogo";
import ProductsButton from './ProductsButton';

const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false })

const Navbar = () => {
  return (
    <nav className="w-full shadow-md px-4 py-3 flex items-center justify-between">
      {/* Izquierda - Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/" aria-label="Home">
          <CompanyLogo className="h-8 w-8 fill-primary" />
        </Link>
      </div>

      {/* Centro - Nombre eCommerce */}
      <div className="text-xl font-bold hidden sm:block text-primary">
        <Link href="/" aria-label="Home">
          Mi E-Commerce
        </Link>
      </div>

      {/* Derecha - Input, toggle de tema, auth y carrito */}
      <div className="flex items-center space-x-4">
        <SearchInput />
        <ThemeToggle />
        <ProductsButton />
        <AccountButton />
        <CartButton />
      </div>
    </nav>
  );
};

export default Navbar;