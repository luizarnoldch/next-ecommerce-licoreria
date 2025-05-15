"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createPreference } from "@/actions/mercado_pago/index";

type CartProduct = {
  id: string;
  name: string;
  variant?: string;
  imageUrl: string;
  price: number;
  priceOriginal?: number;
  quantity: number;
};

interface Props {
  cartProducts: CartProduct[];
}

export default function CheckoutButton({ cartProducts }: Props) {
  const [isPending, startTransition] = useTransition();

  // Prepare MercadoPago items shape
  const prepareItemsForMP = () => {
    return cartProducts.map((product) => ({
      id: product.id,
      title: product.name,
      description: product.variant ?? undefined,
      picture_url: product.imageUrl,
      quantity: product.quantity,
      currency_id: "PEN", // Adjust your currency accordingly
      unit_price: product.price,
    }));
  };

  const handleCheckout = () => {
    startTransition(async () => {
      if (cartProducts.length === 0) {
        return;
      }
      try {
        const items = prepareItemsForMP();
        const init_point = await createPreference(items);
        if (init_point) {
          window.location.href = init_point;
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button onClick={handleCheckout} disabled={isPending} className="mt-6 w-full">
      {isPending ? "Processing..." : "Go to checkout"}
    </Button>
  );
}