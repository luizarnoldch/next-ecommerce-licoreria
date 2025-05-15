import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CircleUserIcon, Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  imageUrl: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Carlos Jimenez",
    role: "Youtuber",
    imageUrl: "/testimonials/carlos.png",
    text:
      "Cocteles imperdibles, la comida también tiene lo suyo. Precios regulares para la zona, cocteles alrededor de 160 pesos. El equilibrio en los sabores de los cocteles es verdaderamente perfecto, combinaciones fuera de lo común.",
    rating: 4.5,
  },
  {
    name: "Camila Blas",
    role: "Tiktoker",
    imageUrl: "/testimonials/camila.png",
    text:
      "No por nada es el bar #13 en el mundo. Coctelería de primer nivel, aunque un poco caro, lo vale. Es perfecto para el precopeo o una noche tranquila y agradable. El personal es experto.",
    rating: 4.7,
  },
  {
    name: "John Doe",
    role: "Instagramer",
    imageUrl: "/testimonials/camila.png",
    text:
      "No por nada es el bar #13 en el mundo. Coctelería de primer nivel, aunque un poco caro, lo vale. Es perfecto para el precopeo o una noche tranquila y agradable. El personal es experto.",
    rating: 4.7,
  },
];

const Testimonials = () => {
  return (
    <section
      aria-label="Customer testimonials"
      className="flex flex-col items-center py-12 container mx-auto px-4"
    >
      <h2 className="text-3xl font-extrabold text-primary dark:text-primary-light text-center">
        ¿Qué opinan nuestros clientes?
      </h2>
      <ScrollArea className="w-full overflow-x-auto mt-8 rounded-lg" type="auto">
        <div className="flex gap-6 min-w-max py-4">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="w-[320px] sm:w-[400px] lg:w-[480px] h-[330px] bg-primary/90 dark:bg-primary-light/90 text-white rounded-lg shadow-lg transition-colors"
            >
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="text-base leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center mt-6">
                  <CircleUserIcon className="w-12 h-12 rounded-full mr-4 text-white/90" />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm opacity-75">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-medium">{testimonial.rating.toFixed(1)}</span>
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
};

export default Testimonials;