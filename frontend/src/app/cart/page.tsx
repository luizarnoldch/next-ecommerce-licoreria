import prisma from "@/lib/prisma";
import CartList from "./CartList";

export default async function CartPage() {
  // Aquí simulas items en carrito: tu lógica real debe obtener del usuario
  const cartItemIds = [1, 2, 3]; // ids de productos añadidos

  const products = await prisma.product.findMany({
    where: { id: { in: cartItemIds } },
  });

  // Suponiendo 1 unidad por producto en demo
  const initialCartProducts = products.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    variant: undefined,
    imageUrl: p.imageUrl ?? "",
    price: p.price,
    priceOriginal: p.originalPrice ?? undefined,
    quantity: 1,
  }));

  return <CartList initialCartProducts={initialCartProducts} />;
}