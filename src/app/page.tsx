import HeroBanner from '@/app/_components/HeroBanner'
import React from 'react'
import Offers from './_components/Offers'
import AboutUs from './_components/AboutGrid'
import Categories from './_components/Categories'
import Testimonials from './_components/Testimonial'

type Props = {}

const HomePage = (props: Props) => {
  return <section className="w-full min-h-screen bg-primary-foreground">
    <div className='container mx-auto'>
      <HeroBanner />
      <Offers />
      <AboutUs />
    </div>
    <Categories />
    <Testimonials />
  </section>
}

export default HomePage
