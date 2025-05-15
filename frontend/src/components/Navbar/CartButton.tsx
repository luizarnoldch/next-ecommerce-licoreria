// components/CartButton.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const CartButton = () => {
  return (
    <Button asChild variant="ghost" size="icon" aria-label="Carrito" title="Carrito de compras">
      <Link href="/cart" className="flex items-center">
        <ShoppingCart className="h-6 w-6 stroke-current" />
      </Link>
    </Button>
  );
}

export default CartButton;