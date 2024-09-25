'use client'

import Image from 'next/image'
import { FC } from 'react'
import ShoppingCardQuantityButton from './ShoppingCardQuantityButton'
import ShoppingCardRemoveButton from './ShoppingCardRemoveButton'
import { Product } from '@/types/product'

type ShoppingCardItemProps = Product

const ShoppingCardItem: FC<ShoppingCardItemProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  state,
}) => {
  return (
    <div className="flex w-full h-[120px]">
      <div className="relative w-[35%] h-full">
        <Image
          src={imageUrl}
          fill
          alt={`${name}_product`}
          className="object-cover rounded-md"
        />
      </div>
      <div className="w-[65%] h-full flex flex-col justify-between pl-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-lg font-bold">${price}</p>
        </div>
        <p className="text-sm text-gray-500">{state}</p>
        <div className="flex items-center justify-between">
          <ShoppingCardQuantityButton productId={id} quantity={quantity} />
          <ShoppingCardRemoveButton productId={id} />
        </div>
      </div>
    </div>
  )
}

export default ShoppingCardItem
