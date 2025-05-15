import Image from "next/image";

const HeroBanner = () => {
  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-h-[512px] min-h-[280px] rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/banner/hero.png"
          alt="hero banner"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};

export default HeroBanner;