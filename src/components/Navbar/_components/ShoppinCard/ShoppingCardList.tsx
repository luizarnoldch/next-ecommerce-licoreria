import { FC } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import ShoppingCardItem from './ShoppingCardItem'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ShoppingCardListProps = {
  items: Product[]
}

const ShoppingCardList: FC<ShoppingCardListProps> = ({ items }) => {
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="w-[320px] lg:w-[400px] border-none">
      <CardContent className="p-0 max-h-[360px] h-full overflow-y-auto custom-scrollbar">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-2">
            {items.map((item) => (
              <ShoppingCardItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                imageUrl={item.imageUrl}
                state={item.state}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 py-2">
        <span className="text-lg font-bold">Amount: ${totalAmount}</span>
        <div className="flex justify-between items-center w-full">
          <Button asChild size="sm" className="xl:w-24 xl:h-12" variant="ghost">
            <Link href="/shoppingcar">View Car</Link>
          </Button>
          <Button asChild size="sm" className="xl:w-24 xl:h-12">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ShoppingCardList
