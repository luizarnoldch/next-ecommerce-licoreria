export type Product = {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  state: 'Available' | 'Seasonal' | 'Discount'
}
