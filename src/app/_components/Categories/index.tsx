import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

type Category = {
  title: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
};

const categories: Category[] = [
  {
    title: 'Whiskies',
    imageUrl: '/categories/category1.png',
  },
  {
    title: 'Vodkas',
    imageUrl: '/categories/category2.png',
  },
  {
    title: 'Burbujas',
    imageUrl: '/categories/category3.png',
  },
];

const Categories = () => {
  return (
    <section className="flex flex-col items-center pt-8">
      <h2 className="text-3xl font-bold text-[#1E1E1E]">Categories</h2>
      <p className="mt-2 text-[#1E1E1E]/50">Encuentra todo lo que buscas aquí</p>
      <div className='w-full bg-[#E6F0DA] pt-2 pb-10 mt-8 flex flex-col justify-center items-center'>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg">
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  className="rounded-md mb-4 w-full h-[500px] object-cover"
                  style={{ maxWidth: '350px', maxHeight: '500px' }}
                />
                <h3 className="font-semibold text-lg text-[#1E1E1E]">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 mt-2">Los mejores vodkas selectos aquí</p>
        <button className="mt-4 px-6 py-2 bg-[#7EA592] text-white font-semibold rounded-full flex gap-2">
          Explorar <ArrowRight />
        </button>
      </div>
    </section>
  );
}

export default Categories;