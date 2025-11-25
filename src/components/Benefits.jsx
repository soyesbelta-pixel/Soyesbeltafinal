import { motion } from 'framer-motion';
import { Shield, Truck, Award, Clock, MessageCircle } from 'lucide-react';
import { useState, useRef } from 'react';

const Benefits = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Estado para controlar hover manualmente
  const scrollContainerRef = useRef(null);

  // --- 1. DEFINICIÓN DE ANIMACIONES DE ICONOS (Lucide) ---
  const iconVariants = {
    shield: {
      rest: { scale: 1 },
      hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } }
    },
    truck: {
      rest: { x: 0 },
      hover: { x: [0, 5, 0], transition: { repeat: Infinity, duration: 1.5 } }
    },
    award: {
      rest: { rotate: 0 },
      hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }
    },
    clock: {
      rest: { rotate: 0 },
      hover: { rotate: [0, 15, -15, 0], transition: { duration: 0.5 } }
    }
  };

  const benefits = [
    {
      icon: Shield,
      variant: "shield",
      title: "Garantía de 30 días",
      description: "Satisfacción garantizada o devolución completa de tu dinero",
      color: "from-esbelta-sand to-esbelta-sand-dark",
      shadow: "shadow-esbelta-sand/30"
    },
    {
      icon: Truck,
      variant: "truck",
      title: "Envío Express",
      description: "Entrega rápida en 24-48 horas a todo el país",
      color: "from-esbelta-terracotta to-esbelta-terracotta-dark",
      shadow: "shadow-esbelta-terracotta/30"
    },
    {
      icon: Award,
      variant: "award",
      title: "Calidad Premium",
      description: "Certificación ISO 9001 y materiales de primera calidad",
      color: "from-esbelta-chocolate to-esbelta-chocolate-dark",
      shadow: "shadow-esbelta-chocolate/30"
    },
    {
      icon: Clock,
      variant: "clock",
      title: "Soporte 24/7",
      description: "Asesoría personalizada en cualquier momento",
      color: "from-esbelta-sand to-esbelta-terracotta",
      shadow: "shadow-esbelta-terracotta/30"
    }
  ];

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  // --- 2. COMPONENTES AUXILIARES ---
  const AnimatedIcon = ({ Icon, variant, isHovered }) => {
    return (
       <motion.div 
         variants={iconVariants[variant]}
         animate={isHovered ? "hover" : "rest"}
       >
         <Icon strokeWidth={1.5} className="w-7 h-7 text-white" />
       </motion.div>
    );
  };

  // --- 3. RENDERIZADOR DE EFECTOS ESPECIALES ÚNICOS ---
  const renderSpecialEffect = (variant, forceActive = false) => {
    const trigger = forceActive ? "hover" : "rest";
    
    switch (variant) {
      case 'shield': // EFECTO: CAMPO DE FUERZA (Ondas de Radar)
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute border border-esbelta-sand/40 rounded-full"
                style={{ width: '60px', height: '60px' }}
                initial={{ scale: 1, opacity: 0 }}
                animate={trigger}
                variants={{
                  rest: { scale: 1, opacity: 0 },
                  hover: {
                    scale: [1, 4],
                    opacity: [0.8, 0],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
              />
            ))}
          </div>
        );

      case 'truck': // EFECTO: ORBITA (Camión Viajero)
        return (
          <>
            <motion.div
              className="absolute w-8 h-8 text-esbelta-terracotta z-50 pointer-events-none"
              initial={{ opacity: 0, top: "0%", left: "0%" }}
              animate={trigger}
              variants={{
                rest: { opacity: 0, top: "0%", left: "0%" },
                hover: {
                  opacity: 1,
                  top: ["-5%", "-5%", "85%", "85%", "-5%"],
                  left: ["-5%", "85%", "85%", "-5%", "-5%"],
                  rotate: [0, 90, 180, 270, 360],
                  transition: { duration: 4, ease: "linear", repeat: Infinity, repeatDelay: 1 }
                }
              }}
            >
              <Truck strokeWidth={2.5} className="w-full h-full drop-shadow-md fill-white" />
            </motion.div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-40 rounded-2xl">
                <motion.rect
                  width="100%" height="100%" rx="16" fill="none"
                  stroke="#C96F7B" strokeWidth="4" strokeOpacity="0.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={trigger}
                  variants={{
                    rest: { pathLength: 0, opacity: 0 },
                    hover: { 
                      pathLength: 1, opacity: 1,
                      transition: { duration: 4, ease: "linear", repeat: Infinity, repeatDelay: 1 } 
                    }
                  }}
                />
            </svg>
          </>
        );

      case 'award': // EFECTO: ESTALLIDO DE ESTRELLAS (Confeti)
        return (
          <div className="absolute top-10 left-10 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => {
              const randomAngle = i * 60;
              const distance = 80;
              const x = Math.cos(randomAngle * (Math.PI / 180)) * distance;
              const y = Math.sin(randomAngle * (Math.PI / 180)) * distance;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-sm"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={trigger}
                  variants={{
                    rest: { opacity: 0, x: 0, y: 0, scale: 0 },
                    hover: {
                      opacity: [0, 1, 0],
                      x: [0, x],
                      y: [0, y],
                      scale: [0, 1, 0],
                      rotate: [0, 180],
                      transition: { 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: Math.random() * 0.5, 
                        ease: "easeOut" 
                      }
                    }
                  }}
                />
              );
            })}
            <motion.div 
               className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%]"
               style={{ x: '-100%' }}
               animate={trigger}
               variants={{
                 rest: { x: '-100%' },
                 hover: {
                   x: '100%',
                   transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
                 }
               }}
            />
          </div>
        );

      case 'clock': // EFECTO: BURBUJAS DE CHAT (Soporte Vivo)
        return (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             {[1, 2].map((i) => (
               <motion.div
                 key={i}
                 className="absolute"
                 initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                 animate={trigger}
                 variants={{
                   rest: { opacity: 0, y: 0, scale: 0 },
                   hover: {
                     opacity: [0, 1, 0],
                     y: [0, -40 - (i * 15)],
                     x: [0, i % 2 === 0 ? 20 : -20],
                     scale: [0.5, 1, 0.8],
                     transition: { 
                       duration: 2, 
                       repeat: Infinity, 
                       delay: i * 0.8,
                       ease: "easeOut"
                     }
                   }
                 }}
               >
                 <div className="bg-esbelta-terracotta text-white p-1.5 rounded-lg rounded-bl-none shadow-sm">
                    <MessageCircle size={12} fill="currentColor" />
                 </div>
               </motion.div>
             ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="beneficios" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
            ¿Por qué elegir Esbelta?
          </h2>
          <p className="text-esbelta-chocolate-light max-w-2xl mx-auto">
            Nos comprometemos con tu satisfacción y resultados. Cada producto está respaldado
            por nuestra garantía de calidad y servicio excepcional.
          </p>
        </div>

        {/* Benefits - Mobile Carousel / Desktop Grid */}
        <div className="relative mb-12">
          {/* Mobile Carousel */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 px-4 -mx-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg flex-shrink-0 w-[85vw] snap-center relative overflow-hidden border border-transparent"
              >
                {/* Render Mobile Effects (Always Active = true) */}
                {renderSpecialEffect(benefit.variant, true)}

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} ${benefit.shadow} shadow-lg flex items-center justify-center mb-4 relative z-10`}>
                  <AnimatedIcon Icon={benefit.icon} variant={benefit.variant} isHovered={true} />
                </div>
                <h3 className="font-bold text-esbelta-chocolate mb-2 relative z-10">{benefit.title}</h3>
                <p className="text-sm text-esbelta-chocolate-light relative z-10">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile Dots Indicator */}
          <div className="md:hidden flex justify-center gap-2 mt-4">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = scrollContainerRef.current.offsetWidth * 0.85;
                    scrollContainerRef.current.scrollTo({
                      left: cardWidth * index,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-8 bg-esbelta-terracotta'
                    : 'w-2 bg-esbelta-sand'
                }`}
              />
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                // Manejo manual del Hover para asegurar que se active
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden border border-transparent hover:border-esbelta-sand/20"
              >
                {/* Render Desktop Effects (Solo si hoveredIndex coincide) */}
                {renderSpecialEffect(benefit.variant, hoveredIndex === index)}

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} ${benefit.shadow} shadow-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 relative z-10`}>
                   <AnimatedIcon Icon={benefit.icon} variant={benefit.variant} isHovered={hoveredIndex === index} />
                </div>
                <h3 className="font-bold text-esbelta-chocolate mb-2 group-hover:text-esbelta-terracotta transition-colors relative z-10">
                  {benefit.title}
                </h3>
                <p className="text-sm text-esbelta-chocolate-light relative z-10">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Benefits;
