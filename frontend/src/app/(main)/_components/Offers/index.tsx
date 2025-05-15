import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Offers = () => {
  return (
    <aside className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto items-center lg:items-start">
      <div className="flex flex-col gap-6 w-full lg:w-60 text-primary dark:text-primary-light">
        <h1 className="text-3xl font-extrabold">Ofertas del mes Whiskero</h1>
        <p className="text-muted-foreground">
          Encuentra tus marcas favoritas al mejor precio
        </p>
        <Button asChild variant="default" className="flex items-center gap-2">
          <Link href={"/"}>
            Ver más <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>

      <ScrollArea className="w-full overflow-x-hidden">
        <div className="flex gap-6 p-4 min-w-[600px] w-max">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card
              key={index}
              className="min-w-[280px] bg-background dark:bg-background-dark border border-border rounded-2xl shadow-md transition-colors"
            >
              <CardContent className="h-[300px] p-0 rounded-t-2xl overflow-hidden">
                <div className="relative h-full w-full rounded-t-2xl">
                  <Image
                    src="/offers/offer1.png"
                    fill
                    alt={`offer-${index + 1}`}
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 640px) 100vw, 280px"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start px-4 py-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Whiskey GLENFIDDICH
                </h3>
                <p className="text-muted-foreground text-lg">S/ 450.00</p>
              </CardFooter>
            </Card>
          ))}
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Offers;