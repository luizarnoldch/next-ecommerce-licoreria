import React from 'react';

// Componentes
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Props = {}

const Offers = (props: Props) => {
  return (
    <aside className='flex justify-center lg:items-start lg:flex-row p-4 gap-6 my-8 flex-col items-center'>
      <div className='text-black flex flex-col justify-start items-start gap-6 w-60'>
        <h1 className='text-3xl font-bold'>Ofertas del mes Whiskero</h1>
        <p>Encuentra tus marcas favoritas</p>
        <Button asChild className='flex justify-center items-center gap-4'>
          <Link href={"/"}>
            Ver más <ArrowRight />
          </Link>
        </Button>
      </div>
      <ScrollArea className='w-full overflow-x-hidden'>
        <div className='flex gap-4 p-4 min-w-[600px] w-max'> {/* Utiliza w-max para que el contenido tenga un ancho dinámico */}
          {[1, 2, 3, 4,5].map((_, index) => (
            <Card key={index} className='min-w-[300px] bg-transparent shadow-none border-none'>
              <CardContent className='h-[300px] w-[300px] bg-transparent'>
                <div className='relative h-full rounded-full shadow-lg'>
                  <Image
                    src={"/offers/offer1.png"}
                    fill
                    alt={`offer${index + 1}`}
                    className='object-cover rounded-xl shadow-lg'
                    sizes="300px"
                  />
                </div>
              </CardContent>
              <CardFooter className='flex flex-col justify-center items-start'>
                <h3 className='text-[#1E1E1E] text-lg'>Whiskey GLENFIDDICH</h3>
                <p className='text-[#1E1E1E]/50 text-lg'>S/ 450.00</p>
              </CardFooter>
            </Card>
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </aside>
  )
}

export default Offers;
