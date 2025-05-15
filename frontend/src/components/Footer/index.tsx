"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import CompanyLogo from "@/assets/CompanyLogo";
import {
  FaFacebookF,
  FaXTwitter,
  FaCopyright,
} from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

const navItems = [
  { path: "/", label: "Inicio" },
  { path: "/products", label: "Productos" },
  { path: "/about", label: "Nosotros" },
  { path: "/contact", label: "Contacto" },
  { path: "/blog", label: "Blog" },
];

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer className="w-full bg-primary dark:bg-primary-dark py-8 text-white transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row justify-between px-4 gap-12">
        <div className="flex flex-col gap-6 max-w-sm">
          <CompanyLogo className="fill-current text-white" />
          <p className="opacity-80">
            Síguenos en nuestras redes sociales
          </p>
          <div className="flex gap-4">
            {[FaFacebookF, RiInstagramFill, FaXTwitter].map((Icon, idx) => (
              <Link
                key={idx}
                href="/"
                className="size-8 rounded-full ring-1 ring-white flex justify-center items-center hover:bg-white/20 transition"
                aria-label={`Visita nuestra cuenta de ${Icon.name
                  .replace("Fa", "")
                  .replace("Ri", "")}`}
              >
                <Icon className="fill-current text-white w-5 h-5" />
              </Link>
            ))}
          </div>
          <span className="flex gap-2 justify-center items-center mt-10 text-sm opacity-70">
            <FaCopyright className="fill-current w-4 h-4" />
            2023 Todos los derechos reservados
          </span>
        </div>

        <nav className="flex flex-col justify-center items-center text-white/70 md:text-left md:items-start">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 w-full text-center md:text-left rounded-md transition-colors
                ${item.path === pathname
                  ? "font-bold text-white bg-white/10"
                  : "hover:text-white hover:bg-white/20"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;