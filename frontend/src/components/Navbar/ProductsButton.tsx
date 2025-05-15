import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { RiTShirt2Line } from "react-icons/ri";

type Props = {}

const ProductsButton = (props: Props) => {
  return (
    <Button asChild variant="ghost" size="sm" className="ml-4 hidden sm:inline-flex">
      <Link href="/products">
        <RiTShirt2Line className="h-5 w-5" />
      </Link>
    </Button>
  )
}

export default ProductsButton