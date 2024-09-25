'use client'

// Utils
import { FC } from 'react'
import { ShoppingCartIcon } from 'lucide-react'
import { useShoppingCar } from '@/hooks/useShoppingCar'

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import ShoppingCardList from './ShoppingCardList'

const ShoppingCar: FC = () => {
  const { items } = useShoppingCar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ShoppingCartIcon className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-max">
        <DropdownMenuLabel>Shopping Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ShoppingCardList items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ShoppingCar
