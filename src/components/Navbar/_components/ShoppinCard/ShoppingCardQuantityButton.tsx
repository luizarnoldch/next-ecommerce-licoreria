'use client'

import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import { useShoppingCar } from '@/hooks/useShoppingCar'

type ShoppingCardQuantityButtonProps = {
  productId: string
  quantity: number
}

const ShoppingCardQuantityButton: React.FC<ShoppingCardQuantityButtonProps> = ({
  productId,
  quantity,
}) => {
  const increaseQuantity = useShoppingCar((state) => state.increaseQuantity)
  const decreaseQuantity = useShoppingCar((state) => state.decreaseQuantity)

  const handleIncreaseQuantity = () => {
    increaseQuantity(productId)
  }

  const handleDecreaseQuantity = () => {
    decreaseQuantity(productId)
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleDecreaseQuantity}
        size="sm"
        className="size-6 p-1"
        disabled={quantity === 1}
      >
        <MinusIcon className="" />
      </Button>
      <span className="text-lg text-center font-semibold w-3">{quantity}</span>
      <Button onClick={handleIncreaseQuantity} size="sm" className="size-6 p-1">
        <PlusIcon className="" />
      </Button>
    </div>
  )
}

export default ShoppingCardQuantityButton
