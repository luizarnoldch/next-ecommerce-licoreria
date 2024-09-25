'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { useShoppingCar } from '@/hooks/useShoppingCar' // Importamos el hook

type ShoppingCardRemoveButtonProps = {
  productId: string
}

const ShoppingCardRemoveButton: React.FC<ShoppingCardRemoveButtonProps> = ({
  productId,
}) => {
  const removeItem = useShoppingCar((state) => state.removeItem)

  const handleRemoveItem = () => {
    removeItem(productId)
  }

  return (
    <Button
      onClick={handleRemoveItem}
      variant="destructive"
      className="h-6 px-2"
    >
      Remove
    </Button>
  )
}

export default ShoppingCardRemoveButton
