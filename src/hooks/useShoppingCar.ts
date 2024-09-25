import { Product } from '@/types/product'
import { create } from 'zustand'

// JSON con los productos iniciales
const initialItems: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 20,
    quantity: 2,
    imageUrl: '/products/chair.png',
    state: 'Available',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 35,
    quantity: 1,
    imageUrl: '/products/chair.png',
    state: 'Seasonal',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 50,
    quantity: 3,
    imageUrl: '/products/chair.png',
    state: 'Discount',
  },
  // Puedes agregar más productos aquí
]

type CartStateAction = {
  // State
  items: Product[]

  // Action
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
}

export const useShoppingCar = create<CartStateAction>((set) => ({
  items: initialItems, // Inicializamos con los productos del JSON

  addItem: (product: Product) =>
    set((state) => {
      const existingProduct = state.items.find((i) => i.id === product.id)
      if (existingProduct) {
        return {
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + product.quantity }
              : i
          ),
        }
      } else {
        return { items: [...state.items, product] }
      }
    }),

  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((product) => product.id !== id),
    })),

  increaseQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    })),

  decreaseQuantity: (id: string) =>
    set((state) => ({
      items: state.items.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
    })),
}))
