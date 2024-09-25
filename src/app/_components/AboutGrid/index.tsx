import React from 'react';
import { Leaf, Package, PhoneOutgoing } from 'lucide-react';

type Props = {}

const AboutUs = (props: Props) => {
  return (
    <section className="flex flex-col items-center p-12">
      <h2 className="text-3xl font-bold text-[#1E1E1E]">Sobre Nosotros</h2>
      <p className="text-[#1E1E1E]/50 mt-2">Ordena ahora y recibe un cupón de S/20 soles</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#7EA592] p-4 rounded-full">
            <Leaf className="text-white" size={36} />
          </div>
          <h3 className="font-semibold text-lg mt-4 text-[#1E1E1E]">Productos de Calidad</h3>
          <p className="text-[#1E1E1E]/50 mt-2">En "El Malecon" buscamos que nuestros clientes queden satisfechos.</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-[#7EA592] p-4 rounded-full">
            <Package className="text-white" size={36} />
          </div>
          <h3 className="font-semibold text-lg mt-4 text-[#1E1E1E]">Entregas Rápidas</h3>
          <p className="text-[#1E1E1E]/50 mt-2">El tiempo de entrega es de 30min. como mínimo.</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-[#7EA592] p-4 rounded-full">
            <PhoneOutgoing className="text-white" size={36} />
          </div>
          <h3 className="font-semibold text-lg mt-4 text-[#1E1E1E]">Atención 24/7</h3>
          <p className="text-[#1E1E1E]/50 mt-2">Atenderemos todos tus pedidos las 24 horas del día.</p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
