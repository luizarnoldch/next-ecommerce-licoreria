import Image from 'next/image';
import React from 'react';

type Props = {};

const HeroBanner = (props: Props) => {
  return (
    <div className='w-full h-full sm:py-6 px-4'>
      <div className='relative w-full sm:h-[512px] min-h-[250px] h-full rounded-2xl'>
        <Image
          src="/banner/hero.png"
          alt="hero_banner"
          fill
          className='object-contain sm:object-fit'
          priority // Añadir la propiedad priority aquí
        />
      </div>
    </div>
  );
};

export default HeroBanner;