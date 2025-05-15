import HeroBanner from "./_components/HeroBanner";
import Offers from "./_components/Offers";
import AboutUs from "./_components/AboutUs";
import Testimonials from "./_components/Testimonial";

const HomePage = () => {
  return (
    <section className="w-full min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <HeroBanner />
        <Offers />
        <AboutUs />
      </div>
      <Testimonials />
    </section>
  );
};

export default HomePage;