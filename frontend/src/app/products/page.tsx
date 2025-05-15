// app/products/page.tsx (or wherever)
import ProductsFilter from './ProductsFilter';
import prisma from '@/lib/prisma';

export default async function ProductsPage() {
  const products = await prisma.product.findMany();
  return <ProductsFilter products={products} />;
}