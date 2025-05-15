"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Product = {
  id: number;
  category: string | null;
  name: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  rating: number | null;
  imageUrl: string | null;
};

export default function ProductsFilter({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<string[]>([]);

  const handleFilterChange = (category: string) => {
    setFilters((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filteredProducts = filters.length
    ? products.filter((p) => p.category && filters.includes(p.category))
    : products;

  // Format price helper
  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`;
  };

  return (
    <section className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full md:w-1/4 space-y-6 p-4 bg-card rounded-md shadow-sm dark:bg-card-dark">
          <h2 className="text-xl font-semibold text-primary">Filtrar por</h2>
          {["whiskey", "vodka", "champan"].map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={category}
                checked={filters.includes(category)}
                onCheckedChange={() => handleFilterChange(category)}
              />
              <label
                htmlFor={category}
                className="cursor-pointer select-none capitalize text-foreground"
              >
                {category}
              </label>
            </div>
          ))}
        </aside>

        {/* Product grid */}
        <main className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">
              No products found with selected filters.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full aspect-[4/3]"
                    priority
                  />
                )}
                <CardContent className="flex flex-col gap-2 p-4">
                  <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-red-600 dark:text-red-500 font-semibold">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="line-through text-muted-foreground">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                    {product.discount && (
                      <p className="text-green-600 dark:text-green-500 font-medium">{product.discount}</p>
                    )}
                  </div>
                  <p className="text-yellow-500 font-medium">
                    Rating: {product.rating ?? "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </main>
      </div>
    </section>
  );
}