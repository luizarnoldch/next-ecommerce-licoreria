"use client"

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

type Product = {
  id: number;
  category: string;
  imageUrl: string;
  name: string;
  price: string;
  discount: string;
  originalPrice: string;
  rating: number;
};

const products: Product[] = [
  // Whiskey
  { id: 1, category: 'whiskey', imageUrl: '/products/whiskey1.png', name: 'Whiskey 1', price: 'S/ 529', discount: '-50%', originalPrice: 'S/ 1,049', rating: 4.5 },
  { id: 2, category: 'whiskey', imageUrl: '/products/whiskey2.png', name: 'Whiskey 2', price: 'S/ 579', discount: '-34%', originalPrice: 'S/ 879', rating: 4.0 },
  { id: 3, category: 'whiskey', imageUrl: '/products/whiskey3.png', name: 'Whiskey 8', price: 'S/ 779', discount: '-38%', originalPrice: 'S/ 1,259', rating: 4.8 },
  { id: 4, category: 'whiskey', imageUrl: '/products/whiskey4.png', name: 'Whiskey 8', price: 'S/ 779', discount: '-38%', originalPrice: 'S/ 1,259', rating: 4.8 },
  { id: 5, category: 'whiskey', imageUrl: '/products/whiskey5.png', name: 'Whiskey 8', price: 'S/ 779', discount: '-38%', originalPrice: 'S/ 1,259', rating: 4.8 },
  { id: 6, category: 'whiskey', imageUrl: '/products/whiskey6.png', name: 'Whiskey 8', price: 'S/ 779', discount: '-38%', originalPrice: 'S/ 1,259', rating: 4.8 },
  { id: 7, category: 'whiskey', imageUrl: '/products/whiskey7.png', name: 'Whiskey 7', price: 'S/ 699', discount: '-44%', originalPrice: 'S/ 1,259', rating: 4.2 },
  { id: 8, category: 'whiskey', imageUrl: '/products/whiskey8.png', name: 'Whiskey 8', price: 'S/ 779', discount: '-38%', originalPrice: 'S/ 1,259', rating: 4.8 },
  // Vodka
  { id: 9, category: 'vodka', imageUrl: '/products/vodka1.png', name: 'Vodka 1', price: 'S/ 499', discount: '-64%', originalPrice: 'S/ 1,399', rating: 4.7 },
  { id: 10, category: 'vodka', imageUrl: '/products/vodka2.png', name: 'Vodka 2', price: 'S/ 549', discount: '-49%', originalPrice: 'S/ 1,079', rating: 4.3 },
  { id: 11, category: 'vodka', imageUrl: '/products/vodka3.png', name: 'Vodka 1', price: 'S/ 499', discount: '-64%', originalPrice: 'S/ 1,399', rating: 4.7 },
  { id: 12, category: 'vodka', imageUrl: '/products/vodka4.png', name: 'Vodka 1', price: 'S/ 499', discount: '-64%', originalPrice: 'S/ 1,399', rating: 4.7 },
  { id: 13, category: 'vodka', imageUrl: '/products/vodka5.png', name: 'Vodka 1', price: 'S/ 499', discount: '-64%', originalPrice: 'S/ 1,399', rating: 4.7 },
  { id: 14, category: 'vodka', imageUrl: '/products/vodka6.png', name: 'Vodka 1', price: 'S/ 499', discount: '-64%', originalPrice: 'S/ 1,399', rating: 4.7 },
  { id: 15, category: 'vodka', imageUrl: '/products/vodka7.png', name: 'Vodka 7', price: 'S/ 649', discount: '-47%', originalPrice: 'S/ 1,229', rating: 4.6 },
  { id: 16, category: 'vodka', imageUrl: '/products/vodka8.png', name: 'Vodka 8', price: 'S/ 679', discount: '-42%', originalPrice: 'S/ 1,179', rating: 4.9 },
  // Champan
  { id: 17, category: 'champan', imageUrl: '/products/champan1.png', name: 'Champan 1', price: 'S/ 799', discount: '-55%', originalPrice: 'S/ 1,799', rating: 4.8 },
  { id: 18, category: 'champan', imageUrl: '/products/champan2.png', name: 'Champan 2', price: 'S/ 849', discount: '-50%', originalPrice: 'S/ 1,699', rating: 4.5 },
  { id: 19, category: 'champan', imageUrl: '/products/champan3.png', name: 'Champan 2', price: 'S/ 849', discount: '-50%', originalPrice: 'S/ 1,699', rating: 4.5 },
  { id: 20, category: 'champan', imageUrl: '/products/champan4.png', name: 'Champan 2', price: 'S/ 849', discount: '-50%', originalPrice: 'S/ 1,699', rating: 4.5 },
  { id: 21, category: 'champan', imageUrl: '/products/champan5.png', name: 'Champan 2', price: 'S/ 849', discount: '-50%', originalPrice: 'S/ 1,699', rating: 4.5 },
  { id: 22, category: 'champan', imageUrl: '/products/champan6.png', name: 'Champan 2', price: 'S/ 849', discount: '-50%', originalPrice: 'S/ 1,699', rating: 4.5 },
  { id: 23, category: 'champan', imageUrl: '/products/champan7.png', name: 'Champan 7', price: 'S/ 899', discount: '-45%', originalPrice: 'S/ 1,629', rating: 4.7 },
  { id: 24, category: 'champan', imageUrl: '/products/champan8.png', name: 'Champan 8', price: 'S/ 949', discount: '-40%', originalPrice: 'S/ 1,579', rating: 4.9 },
];

const ProductsPage = () => {
  const [filters, setFilters] = useState<string[]>([]);

  const handleFilterChange = (category: string) => {
    setFilters((prevFilters) =>
      prevFilters.includes(category)
        ? prevFilters.filter((filter) => filter !== category)
        : [...prevFilters, category]
    );
  };

  const filteredProducts = filters.length
    ? products.filter((product) => filters.includes(product.category))
    : products;

  return (
    <div className='w-full bg-primary-foreground min-h-screen'>
      <div className='container mx-auto flex'>
        <aside className='w-1/4 p-6'>
          <h2 className='text-xl font-bold mb-4 text-primary'>Filtrar por</h2>
          <div className='mb-4 text-primary'>
            <Checkbox
              id='whiskey'
              checked={filters.includes('whiskey')}
              onCheckedChange={() => handleFilterChange('whiskey')}
            />
            <label htmlFor='whiskey' className='ml-2 cursor-pointer'>Whiskey</label>
          </div>
          <div className='mb-4 text-primary'>
            <Checkbox
              id='vodka'
              checked={filters.includes('vodka')}
              onCheckedChange={() => handleFilterChange('vodka')}
            />
            <label htmlFor='vodka' className='ml-2 cursor-pointer'>Vodka</label>
          </div>
          <div className='mb-4 text-primary'>
            <Checkbox
              id='champan'
              checked={filters.includes('champan')}
              onCheckedChange={() => handleFilterChange('champan')}
            />
            <label htmlFor='champan' className='ml-2 cursor-pointer'>Champan</label>
          </div>
        </aside>
        <aside className='w-3/4 p-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredProducts.map((product) => (
              <Card key={product.id} className='p-4'>
                <CardContent>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className='object-cover w-full h-48'
                    priority
                  />
                  <h3 className='mt-4 text-lg font-bold'>{product.name}</h3>
                  <p className='text-red-500'>{product.price} <span className='line-through text-gray-500'>{product.originalPrice}</span></p>
                  <p className='text-green-500'>{product.discount}</p>
                  <p className='text-yellow-500'>Rating: {product.rating}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductsPage;