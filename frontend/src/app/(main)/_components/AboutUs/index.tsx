import { Leaf, Package, PhoneOutgoing } from "lucide-react";

const AboutUs = () => {
  return (
    <section
      className="flex flex-col items-center p-8 md:p-12 max-w-7xl mx-auto"
      aria-labelledby="about-us-title"
    >
      <h2
        id="about-us-title"
        className="text-4xl font-extrabold text-primary dark:text-primary-light"
      >
        Sobre Nosotros
      </h2>
      <p className="text-muted-foreground mt-2 text-center max-w-xl">
        Ordena ahora y recibe un cupón de S/20 soles
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 w-full max-w-5xl">
        {[
          {
            Icon: Leaf,
            title: "Productos de Calidad",
            description:
              "En \"El Malecon\" buscamos que nuestros clientes queden satisfechos.",
            bgColor: "bg-primary",
          },
          {
            Icon: Package,
            title: "Entregas Rápidas",
            description: "El tiempo de entrega es de 30min. como mínimo.",
            bgColor: "bg-primary",
          },
          {
            Icon: PhoneOutgoing,
            title: "Atención 24/7",
            description: "Atenderemos todos tus pedidos las 24 horas del día.",
            bgColor: "bg-primary",
          },
        ].map(({ Icon, title, description, bgColor }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center px-4"
          >
            <div
              className={`${bgColor} p-4 rounded-full flex items-center justify-center shadow-lg`}
            >
              <Icon className="text-background" size={36} />
            </div>
            <h3 className="text-xl font-semibold mt-5 text-primary dark:text-primary-light">
              {title}
            </h3>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;