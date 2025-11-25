import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { Star, ChevronLeft, ChevronRight, Heart, RefreshCw, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "María González",
      location: "Bogotá",
      rating: 5,
      date: "Hace 2 semanas",
      verified: true,
      image: "/cliente1.jpeg", // Foto Polaroid (Cuerpo/Producto)
      avatar: "/avatar-1.jpg", // Foto Perfil
      product: "Cintura Reloj de Arena",
      comment: "Excelente calidad, la compresión es perfecta y el material es muy cómodo. La uso todos los días y ha mejorado mucho mi postura. El servicio al cliente fue excepcional.",
      before: 90,
      after: 75,
      timeUsed: "3 meses"
    },
    {
      id: 2,
      name: "Laura Martínez",
      location: "Medellín",
      rating: 5,
      date: "Hace 1 mes",
      verified: true,
      image: "/cliente2.jpeg",
      avatar: "/avatar-2.jpg",
      product: "Body Reductor",
      comment: "Me encanta! La tela es suave y no se enrolla. He notado una gran diferencia en mi figura. La recomiendo 100%. El envío fue súper rápido.",
      before: 85,
      after: 72,
      timeUsed: "2 meses"
    },
    {
      id: 3,
      name: "Carmen Silva",
      location: "Cali",
      rating: 5,
      date: "Hace 3 semanas",
      verified: true,
      image: "/cliente3.jpeg",
      avatar: "/avatar-3.jpg",
      product: "Faja Deportiva",
      comment: "Perfecta para hacer ejercicio. No se mueve y ayuda mucho con la postura durante el entrenamiento. La calidad es increíble y el precio muy justo.",
      before: 88,
      after: 76,
      timeUsed: "4 meses"
    },
    {
      id: 4,
      name: "Ana Rodríguez",
      location: "Barranquilla",
      rating: 5,
      date: "Hace 2 meses",
      verified: true,
      image: "/cliente4.jpeg",
      avatar: "/avatar-4.jpg",
      product: "Short Levanta Cola",
      comment: "Increíble el efecto levanta cola! Me siento más segura y cómoda. La calidad supera el precio. Ya compré otra de diferente modelo.",
      before: 92,
      after: 78,
      timeUsed: "5 meses"
    }
  ];

  const stats = [
    { label: "Clientas Satisfechas", value: "10k+", icon: <Heart className="w-5 h-5" /> },
    { label: "Calificación Promedio", value: "4.9", icon: <Star className="w-5 h-5" /> },
    { label: "Recompra", value: "89%", icon: <RefreshCw className="w-5 h-5" /> },
    { label: "Recomendación", value: "97%", icon: <ThumbsUp className="w-5 h-5" /> }
  ];

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonios" className="py-24 bg-[#F9F7F5] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="font-heading text-[40vw] leading-none text-chocolate absolute -top-20 -left-20 select-none">“</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-rose font-bold tracking-widest text-xs uppercase mb-3 block"
          >
            Historias Reales
          </motion.span>
          <h2 className="heading-display text-chocolate mb-6">
            Voces <span className="italic text-chocolate-light">Esbelta</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rose to-transparent mx-auto opacity-50"></div>
        </div>

        {/* Render Polaroid Grid Variant (Final Choice) */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Sin AnimatePresence - animación simple */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, rotate: -2, scale: 0.95 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="bg-white p-6 pb-8 rounded-xl shadow-2xl rotate-1 border border-gray-100 relative"
            >
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-1 shadow-sm z-20 backdrop-blur-sm border border-white/20"></div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Photo Side */}
                  <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden aspect-square relative group shadow-inner">
                     {/* Usamos la imagen del testimonio */}
                     <img 
                       src={testimonials[currentIndex].image} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       alt="Foto Cliente" 
                     />
                     {/* Overlay Gradiente */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                     
                     {/* Badge Resultado */}
                     <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-chocolate shadow-lg border border-white/50">
                       <p className="text-[10px] uppercase tracking-wider text-chocolate/60 font-bold mb-0.5">Resultado</p>
                       <p className="text-lg font-heading font-bold">
                         -{testimonials[currentIndex].before - testimonials[currentIndex].after} cm
                       </p>
                     </div>
                  </div>

                  {/* Content Side */}
                  <div className="md:w-1/2 flex flex-col justify-center text-left pr-4 py-4">
                     <div className="font-serif italic text-rose/80 mb-4 text-lg">Querido diario Esbelta...</div>
                     
                     <h3 className="font-heading text-2xl md:text-3xl font-bold text-chocolate mb-6 leading-tight">
                       "{testimonials[currentIndex].comment}"
                     </h3>
                     
                     <div className="mt-auto pt-6 border-t border-line border-dashed w-full">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <img 
                             src={testimonials[currentIndex].avatar} 
                             alt={testimonials[currentIndex].name} 
                             className="w-10 h-10 rounded-full object-cover border border-line"
                           />
                           <div>
                             <p className="font-bold text-chocolate text-lg leading-none">{testimonials[currentIndex].name}</p>
                             <p className="text-xs text-chocolate-light uppercase tracking-wider font-bold mt-1">
                               {testimonials[currentIndex].location}
                             </p>
                           </div>
                         </div>
                         <div className="text-right bg-[#FFF9F0] px-3 py-2 rounded-lg border border-[#EAD9C8]">
                           <div className="flex gap-1 mb-1">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className="w-3 h-3 text-rose fill-current" />
                             ))}
                           </div>
                           <p className="text-xs font-bold text-chocolate/60">Verificado</p>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
            </motion.div>

            {/* Navigation - Floating Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-16 z-20">
              <button 
                onClick={prevTestimonial} 
                className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-chocolate hover:scale-110 hover:text-rose transition-all duration-300 focus:outline-none group border border-gray-100"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-16 z-20">
              <button 
                onClick={nextTestimonial} 
                className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-chocolate hover:scale-110 hover:text-rose transition-all duration-300 focus:outline-none group border border-gray-100"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-16">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex 
                    ? 'w-8 bg-chocolate' 
                    : 'w-2 bg-chocolate/20 hover:bg-chocolate/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-20">
            <p className="text-chocolate/50 mb-6 font-heading italic text-lg">¿Lista para tu propia transformación?</p>
            <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-rose/20 hover:shadow-rose/30">
              Ver Catálogo Completo
            </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;