import React from 'react';

// Componentes
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CircleUserIcon, Star } from 'lucide-react';

type Testimonial = {
  name: string;
  role: string;
  imageUrl: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [

  {
    name: 'Carlos Jimenez',
    role: 'Youtuber',
    imageUrl: '/testimonials/carlos.png',
    text: 'Cocteles imperdibles, la comida también tiene lo suyo. Precios regulares para la zona, cocteles alrededor de 160 pesos. El equilibrio en los sabores de los cocteles es verdaderamente perfecto, combinaciones fuera de lo común.',
    rating: 4.5,
  },
  {
    name: 'Camila Blas',
    role: 'Tiktoker',
    imageUrl: '/testimonials/camila.png',
    text: 'No por nada es el bar #13 en el mundo. Coctelería de primer nivel, aunque un poco caro, lo vale. Es perfecto para el precopeo o una noche tranquila y agradable. El personal es experto.',
    rating: 4.7,
  },
  {
    name: 'John Doe',
    role: 'Instagramer',
    imageUrl: '/testimonials/camila.png',
    text: 'No por nada es el bar #13 en el mundo. Coctelería de primer nivel, aunque un poco caro, lo vale. Es perfecto para el precopeo o una noche tranquila y agradable. El personal es experto.',
    rating: 4.7,
  },
  // Agrega más testimonios si es necesario
];

const Testimonials = () => {
  return (
    <section className="flex flex-col items-center py-12 container mx-auto">
      <h2 className="text-3xl font-bold text-[#1E1E1E]">Que opinan nuestros clientes?</h2>
      <ScrollArea className="flex flex-1 overflow-x-auto mt-8 w-full rounded-lg py-4">
        <div className="flex gap-4 rounded-lg">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="w-[800px] h-[330px] py-12 px-6 bg-[#7EA592] text-white/75 rounded-lg">
              <CardContent className="flex flex-col justify-between h-full">
                <p className="text-lg">{testimonial.text}</p>
                <div className="flex items-center mt-4">
                  <CircleUserIcon className="w-10 h-10 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold text-xl">{testimonial.name}</h3>
                    <p className="text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 text-lg">{testimonial.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default Testimonials;