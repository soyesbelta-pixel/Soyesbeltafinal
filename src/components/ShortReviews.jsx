import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Verified, ThumbsUp, Camera } from 'lucide-react';

const ShortReviews = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;

  const reviews = [
    {
      id: 1,
      name: "Ana R.",
      location: "Bogotá",
      rating: 5,
      date: "Hace 2 días",
      verified: true,
      image: "/cliente1.jpeg",
      productImage: "/short-negro-1.png",
      title: "¡Increíble calidad!",
      comment: "Me gustó mucho la tela y sobre todo su adaptación. Me encantó, muy cómodo para usarlo con jeans o cualquier prenda sin verse las líneas. ¡100% recomendado!",
      likes: 45,
      helpful: 32
    },
    {
      id: 2,
      name: "María T.",
      location: "Medellín",
      rating: 5,
      date: "Hace 5 días",
      verified: true,
      image: "/cliente2.jpeg",
      productImage: "/short-beige-1.png",
      title: "Super cómodo y me levanta los glúteos",
      comment: "Es muy cómodo de llevar en verano todo el día sin molestarme en absoluto. Hice una buena elección al comprar este short, lo super recomiendo.",
      likes: 38,
      helpful: 28
    },
    {
      id: 3,
      name: "Juliana Z.",
      location: "Cali",
      rating: 5,
      date: "Hace 1 semana",
      verified: true,
      image: "/cliente3.jpeg",
      productImage: "/short-cocoa-1.png",
      title: "Me ha quedado super fácil de poner",
      comment: "Me ha quedado perfectamente. Lo encuentro muy cómodo y cumple con lo que esperaba. Además es muy fácil de poner y no se enrolla durante el día.",
      likes: 52,
      helpful: 41
    },
    {
      id: 4,
      name: "Karla R.",
      location: "Cartagena",
      rating: 5,
      date: "Hace 2 semanas",
      verified: true,
      image: "/cliente4.jpeg",
      productImage: "/short-negro-2.png",
      title: "La tela suave, buen precio",
      comment: "Es muy suave, desde que lo uses no vas a querer sacártelo. Me encantó! Por este precio no podía pedir nada mejor, realmente estoy feliz con mi compra.",
      likes: 29,
      helpful: 22
    },
    {
      id: 5,
      name: "Daniela B.",
      location: "Barranquilla",
      rating: 5,
      date: "Hace 3 semanas",
      verified: true,
      image: "/avatar-1.jpg",
      productImage: "/short-beige-2.png",
      title: "El short me quedo perfecto, muy buena calidad",
      comment: "Calidad del tejido y el elástico muy buena. La verdad no esperaba tal comodidad desde el primer día. Estoy muy contenta con mi compra.",
      likes: 67,
      helpful: 53
    },
    {
      id: 6,
      name: "OC - Olga C.",
      location: "Pereira",
      rating: 5,
      date: "Hace 1 mes",
      verified: true,
      image: "/avatar-2.jpg",
      productImage: "/short-cocoa-2.png",
      title: "Estoy contentísima, lo usaría de nuevo",
      comment: "Es muy cómodo cuando lo usas. Fácil de poner y tiene un encanto estético natal. Me encanta la tela suave y el acabado perfecto.",
      likes: 41,
      helpful: 35
    }
  ];

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Calcular estadísticas
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const recommendationRate = 99; // Porcentaje de clientes que recomiendan

  return (
    <section className="py-16 bg-gradient-to-b from-white to-beige/10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-chocolate mb-4">
              Lo que Dicen Nuestras Clientas
            </h2>
            <p className="text-chocolate-light font-body text-lg mb-6 max-w-2xl mx-auto">
              Miles de mujeres ya transformaron su figura con confianza
            </p>

            {/* Rating Summary */}
            <div className="flex items-center justify-center gap-8 flex-wrap bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-lg border border-line">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-heading text-chocolate">{averageRating.toFixed(1)}</span>
                  <Star className="w-8 h-8 text-rose fill-current" />
                </div>
                <p className="text-chocolate-light font-body text-sm">
                  Calificación Promedio
                </p>
              </div>

              <div className="h-16 w-px bg-line hidden md:block" />

              <div className="text-center">
                <div className="text-5xl font-heading text-chocolate mb-2">
                  {totalReviews}+
                </div>
                <p className="text-chocolate-light font-body text-sm">
                  Reseñas Verificadas
                </p>
              </div>

              <div className="h-16 w-px bg-line hidden md:block" />

              <div className="text-center">
                <div className="text-5xl font-heading text-chocolate mb-2">
                  {recommendationRate}%
                </div>
                <p className="text-chocolate-light font-body text-sm">
                  Lo Recomiendan
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-line relative overflow-hidden group"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-4 right-4 w-16 h-16 text-beige/20 -rotate-12 group-hover:text-beige/30 transition-colors" />

              {/* Header: User Info */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-beige shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-body font-bold text-chocolate">
                      {review.name}
                    </h4>
                    {review.verified && (
                      <div className="bg-chocolate text-white p-0.5 rounded-full" title="Cliente Verificado">
                        <Verified className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-chocolate-light font-body text-sm">
                    {review.location}
                  </p>
                  <p className="text-chocolate-light font-body text-xs">
                    {review.date}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-rose fill-current'
                        : 'text-line'
                    }`}
                  />
                ))}
              </div>

              {/* Review Title */}
              <h5 className="font-body font-bold text-chocolate mb-2">
                {review.title}
              </h5>

              {/* Review Comment */}
              <p className="text-chocolate-light font-body text-sm mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* Product Image (if available) */}
              {review.productImage && (
                <div className="mb-4 relative group/image">
                  <img
                    src={review.productImage}
                    alt="Producto"
                    className="w-full h-48 object-cover rounded-xl border border-line"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover/image:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

              {/* Footer: Helpful */}
              <div className="flex items-center justify-between pt-4 border-t border-line">
                <button className="flex items-center gap-2 text-chocolate-light hover:text-chocolate transition-colors group/button">
                  <ThumbsUp className="w-4 h-4 group-hover/button:scale-110 transition-transform" />
                  <span className="text-sm font-body">Útil ({review.helpful})</span>
                </button>
                <span className="text-xs text-chocolate-light font-body">
                  {review.likes} personas encontraron esto útil
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={prevPage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white text-chocolate rounded-full shadow-lg hover:shadow-xl border border-line transition-all disabled:opacity-50"
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentPage
                      ? 'bg-chocolate w-8'
                      : 'bg-line hover:bg-beige'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextPage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white text-chocolate rounded-full shadow-lg hover:shadow-xl border border-line transition-all disabled:opacity-50"
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {/* Trust Badge Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-chocolate to-chocolate-light rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-heading mb-4">
            ¿Lista para Transformar Tu Figura?
          </h3>
          <p className="font-body text-white/90 mb-6 max-w-2xl mx-auto">
            Únete a las miles de mujeres que ya confían en nosotros. Compra hoy con{' '}
            <span className="font-bold">envío gratis</span> y{' '}
            <span className="font-bold">garantía de 30 días</span>.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-chocolate px-8 py-4 rounded-full font-body font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            COMPRAR AHORA
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ShortReviews;
