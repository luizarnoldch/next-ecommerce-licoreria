"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckoutButton from "./CheckoutButton";

type CartProduct = {
  id: string;
  name: string;
  variant?: string;
  imageUrl: string;
  price: number;
  priceOriginal?: number; // For strikethrough price if discounted
  quantity: number;
};

interface Props {
  initialCartProducts: CartProduct[];
}

export default function CartList({ initialCartProducts }: Props) {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(initialCartProducts);

  const totalPrice = cartProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return; // Optional constraint
    setCartProducts((curr) =>
      curr.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const handleRemove = (id: string) => {
    setCartProducts((curr) => curr.filter((p) => p.id !== id));
  };

  return (
    <section className="container mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col md:flex-row gap-10">
      {/* LEFT - Cart and Sign in */}
      <div className="flex-1 max-w-full md:max-w-5xl">
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-2">Already have an account?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in for a better experience.
              </p>
            </div>
            <Button variant="outline">Sign in</Button>
          </div>
          <hr className="my-6 border-neutral-300" />
        </section>
        <h1 className="text-3xl font-bold mb-6">Cart</h1>
        <table className="w-full table-auto border-separate border-spacing-y-4 text-left">
          <thead className="hidden md:table-header-group">
            <tr>
              <th>Item</th>
              <th className="w-30 text-center">Quantity</th>
              <th className="w-60 text-center">Price</th>
              <th className="w-30 text-center">Total</th>
              <th className="w-30 text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {cartProducts.map(({ id, name, variant, imageUrl, price, priceOriginal, quantity }) => (
              <tr
                key={id}
                className="bg-card border border-transparent rounded-lg md:border-neutral-200 dark:md:border-neutral-700"
              >
                <td className="flex items-center gap-4 p-2 md:p-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
                    <Image src={imageUrl} alt={name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground dark:text-foreground-dark">{name}</p>
                    {variant && (
                      <p className="text-muted-foreground text-sm">{`Variant: S/ {variant}`}</p>
                    )}
                  </div>
                </td>
                <td className="p-2 md:p-4 text-center">
                  <select
                    aria-label={`Quantity for S/ {name}`}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(id, Number(e.target.value))}
                    className="max-w-[60px] rounded-md border border-input bg-background px-2 py-1 text-center text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[...Array(10).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 md:p-4 text-right">
                  {priceOriginal && priceOriginal > price ? (
                    <>
                      <span className="line-through text-muted-foreground mr-2">
                        S/ {priceOriginal.toFixed(2)}
                      </span>
                      <span className="font-semibold text-foreground dark:text-foreground-dark">
                        S/ {price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-foreground dark:text-foreground-dark">
                      S/ {price.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="p-2 md:p-4 text-right font-semibold text-foreground dark:text-foreground-dark">
                  S/ {(price * quantity).toFixed(2)}
                </td>
                <td className="p-2 md:p-4 text-center">
                  <button
                    onClick={() => handleRemove(id)}
                    aria-label={`Remove S/ {name} from cart`}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {cartProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* RIGHT - Summary */}
      <aside className="w-full max-w-md p-6 rounded-lg shadow-md bg-card dark:bg-card-dark">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <button className="text-sm text-primary underline mb-6 hover:text-primary/80">
          Add gift card or discount code <span className="sr-only">info</span>
        </button>
        <dl className="space-y-3 text-foreground dark:text-foreground-dark">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-sm">Subtotal</dt>
            <dd className="font-semibold">S/ {totalPrice.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-sm">Shipping</dt>
            <dd className="font-semibold">S/ 0.00</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-sm">Taxes</dt>
            <dd className="font-semibold">S/ 0.00</dd>
          </div>
          <div className="flex justify-between pt-3 border-t border-border text-lg font-bold">
            <dt>Total</dt>
            <dd>S/ {totalPrice.toFixed(2)}</dd>
          </div>
        </dl>
        <CheckoutButton cartProducts={cartProducts} />
      </aside>
    </section>
  );
}