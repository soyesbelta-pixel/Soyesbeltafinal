import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  Clock,
  ChevronDown,
  Heart,
  Package,
  Award,
  CreditCard,
  MessageCircle,
  Sparkles,
  Play,
  Users,
  Gift,
  RefreshCw,
  Droplets,
  Wind,
  Zap,
  ChevronRight,
  Phone
} from 'lucide-react';
import useStore from '../store/useStore';

const ShortInvisibleLandingNew = () => {
  const [countdown, setCountdown] = useState({ hours: 48, minutes: 0, seconds: 0 });
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

  const { addToCart, addNotification } = useStore();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const product = {
    id: 5,
    name: "Kit Esbelta: Short Levanta Glúteo Invisible",
    price: 89990,
    originalPrice: 129000,
    discount: 30,
    rating: 4.9,
    reviews: 567,
    image: "/short-negro-1.png",
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      size: selectedSize,
      color: 'negro'
    });
    addNotification({
      type: 'success',
      message: '¡Kit agregado al carrito!'
    });
  };

  const calculateSize = () => {
    const waistNum = parseInt(waist);
    const hipsNum = parseInt(hips);

    if (waistNum && hipsNum) {
      if (waistNum <= 70 && hipsNum <= 95) return 'XS';
      if (waistNum <= 75 && hipsNum <= 100) return 'S';
      if (waistNum <= 80 && hipsNum <= 105) return 'M';
      if (waistNum <= 85 && hipsNum <= 110) return 'L';
      if (waistNum <= 90 && hipsNum <= 115) return 'XL';
      return '2XL';
    }
    return null;
  };

  const benefits = [
    {
      icon: '🍑',
      title: 'Glúteo con forma natural',
      description: 'Realza sin aplanar, invisible bajo la ropa'
    },
    {
      icon: '✨',
      title: 'Piel más lisa al tacto',
      description: 'Exfoliante pensado para la zona del glúteo'
    },
    {
      icon: '💆',
      title: 'Masaje que suma',
      description: 'Aceite de fenogreco para rutina de masaje y tono'
    }
  ];

  const ritualSteps = [
    {
      step: '1',
      title: 'Exfolia',
      time: '30–60s',
      description: 'Ducha + exfoliante, movimientos circulares',
      icon: Droplets
    },
    {
      step: '2',
      title: 'Masajea',
      time: '60–90s',
      description: 'Aceite de fenogreco, de abajo hacia arriba',
      icon: Wind
    },
    {
      step: '3',
      title: 'Coloca',
      time: '30s',
      description: 'Short invisible, look listo',
      icon: Sparkles
    }
  ];

  const kitIncludes = [
    {
      title: 'Short invisible',
      description: 'Realce natural, compresión media cómoda, costuras planas',
      icon: '👗',
      price: 79000
    },
    {
      title: 'Exfoliante',
      description: 'Textura suave, sensación de piel más lisa',
      icon: '🧴',
      price: 25000
    },
    {
      title: 'Aceite de fenogreco',
      description: 'Para masaje, aroma suave',
      icon: '💧',
      price: 25000
    }
  ];

  const faqs = [
    {
      q: '¿Se marca bajo ropa?',
      a: 'Diseñado para ser invisible; elige tu talla correcta para mejores resultados.'
    },
    {
      q: '¿Pica el exfoliante?',
      a: 'Fórmula suave; evita usar en piel irritada/lastimada.'
    },
    {
      q: '¿Fenogreco aumenta músculo?',
      a: 'Ayuda como parte de masaje + entrenamiento y nutrición adecuados; no es un medicamento. Resultados pueden variar.'
    },
    {
      q: '¿Cómo lavo el short?',
      a: 'A mano, agua fría, secado a la sombra para mantener la calidad.'
    },
    {
      q: '¿Cuánto tarda el envío?',
      a: 'Envío gratis a toda Colombia. Tiempo estimado: 3-5 días hábiles en ciudades principales.'
    }
  ];

  const clientTestimonials = [
    {
      name: 'Carolina M.',
      city: 'Barranquilla',
      size: 'M',
      comment: 'Increíble cómo realza sin ser incómodo, perfecto para usar todo el día',
      rating: 5
    },
    {
      name: 'Valentina S.',
      city: 'Cartagena',
      size: 'S',
      comment: 'Me encanta que no se marca bajo la ropa, se siente super natural',
      rating: 5
    },
    {
      name: 'Daniela P.',
      city: 'Pereira',
      size: 'L',
      comment: 'El kit completo es maravilloso, mi piel quedó suavecita y el short me queda perfecto',
      rating: 5
    },
    {
      name: 'Sofía L.',
      city: 'Bucaramanga',
      size: 'M',
      comment: 'Compré el negro y ya quiero en todos los colores, súper cómodo',
      rating: 5
    },
    {
      name: 'Isabella G.',
      city: 'Cúcuta',
      size: 'XL',
      comment: 'Finalmente encontré un short que realza sin aplanar, me siento segura',
      rating: 5
    },
    {
      name: 'Camila R.',
      city: 'Santa Marta',
      size: 'S',
      comment: 'El exfoliante es mi parte favorita del ritual, mi piel nunca se había sentido tan suave',
      rating: 5
    },
    {
      name: 'Lucía H.',
      city: 'Manizales',
      size: 'M',
      comment: 'Lo uso bajo vestidos y se ve increíble, nadie sabe que llevo short',
      rating: 4
    },
    {
      name: 'Mariana V.',
      city: 'Pasto',
      size: 'L',
      comment: 'El aceite de fenogreco huele delicioso y el masaje se siente muy bien',
      rating: 5
    },
    {
      name: 'Andrea C.',
      city: 'Villavicencio',
      size: 'M',
      comment: 'Calidad premium, se nota en cada detalle. Totalmente vale la pena',
      rating: 5
    },
    {
      name: 'Paula A.',
      city: 'Ibagué',
      size: 'S',
      comment: 'El envío fue rapidísimo y el producto superó mis expectativas',
      rating: 5
    }
  ];

  const testimonials = [
    {
      name: 'Ana R.',
      city: 'Bogotá',
      size: 'M',
      comment: 'Se ve increíble bajo mis jeans, nadie nota que lo llevo puesto',
      image: '/cliente1.jpeg',
      rating: 5
    },
    {
      name: 'María T.',
      city: 'Medellín',
      size: 'L',
      comment: 'El exfoliante dejó mi piel súper suave, me encanta el ritual completo',
      image: '/cliente2.jpeg',
      rating: 5
    },
    {
      name: 'Juliana Z.',
      city: 'Cali',
      size: 'S',
      comment: 'Cómodo todo el día, el aceite huele delicioso y mi piel se siente mejor',
      image: '/cliente3.jpeg',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* LOGO ESBELTA - PRIMERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-4 px-4 bg-white"
      >
        <div className="container mx-auto flex justify-center">
          <img
            src="/logo-esbelta.png"
            alt="Esbelta - Fajas Colombianas Premium"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>
      </motion.div>

      {/* 1) BARRA SUPERIOR FIJA */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 left-0 right-0 z-50 py-3 px-4 text-center"
        style={{ backgroundColor: '#2C1E1E', color: '#FBF7F4' }}
      >
        <div className="container mx-auto">
          <p className="font-body text-sm md:text-base font-medium flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Envío a todo Colombia
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4" />
              Cambios fáciles
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="w-4 h-4" />
              Promo lanzamiento 51% hoy
            </span>
          </p>
        </div>
      </motion.div>

      {/* 2) HERO */}
      <section className="pb-16 px-4" style={{ backgroundColor: '#D7BFA3' }}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={product.image}
                  alt="Kit Esbelta Short Invisible"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Titular */}
              <h1 className="font-heading text-5xl md:text-6xl leading-tight" style={{ color: '#2C1E1E' }}>
                Glúteo con forma en 2 minutos.
              </h1>

              {/* Subtitular */}
              <p className="font-body text-lg leading-relaxed" style={{ color: '#2C1E1E' }}>
                <strong>Kit Esbelta:</strong> short levanta-glúteo invisible + exfoliante para piel más lisa +
                aceite de fenogreco para masaje y tonificación. Ritual 3 pasos, resultados visibles en tu outfit.{' '}
                <span className="text-sm italic">Resultados pueden variar.</span>
              </p>

              {/* CTAs */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-8 rounded-full font-body font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#F88379' }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Comprar Kit ahora
                </motion.button>

                <button
                  onClick={() => {
                    document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 text-center font-body font-medium underline hover:no-underline transition-all"
                  style={{ color: '#2C1E1E' }}
                >
                  Ver cómo funciona →
                </button>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t" style={{ borderColor: '#2C1E1E33' }}>
                <div className="flex items-center gap-2 text-base md:text-lg" style={{ color: '#2C1E1E' }}>
                  <Shield className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">Pago seguro</span>
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg" style={{ color: '#2C1E1E' }}>
                  <Truck className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">Envío rápido</span>
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg" style={{ color: '#2C1E1E' }}>
                  <RefreshCw className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">Cambios fáciles</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3) DECENAS DE CLIENTAS FELICES - CARRUSEL */}
      <section className="py-16 px-4 overflow-hidden" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-3" style={{ color: '#2C1E1E' }}>
              Decenas de clientas felices
            </h2>
            <p className="text-lg font-body" style={{ color: '#2C1E1E88' }}>
              Mira lo que dicen sobre el Short Invisible
            </p>
          </motion.div>

          {/* Carrusel Container */}
          <div className="relative">
            <div className="carousel-container overflow-hidden">
              <div className="carousel-track flex gap-6 animate-scroll">
                {/* Duplicamos los testimonios para efecto infinito */}
                {[...clientTestimonials, ...clientTestimonials].map((testimonial, index) => (
                  <div
                    key={index}
                    className="carousel-card flex-shrink-0 w-[350px] bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-beige to-chocolate flex items-center justify-center text-white font-heading text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-body font-bold text-base" style={{ color: '#2C1E1E' }}>
                          {testimonial.name}
                        </h4>
                        <p className="text-sm font-body" style={{ color: '#2C1E1E88' }}>
                          {testimonial.city} · Talla {testimonial.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#F88379' }} />
                      ))}
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: '#2C1E1E' }}>
                      "{testimonial.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) BENEFICIOS EN 3 BULLETS */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="text-6xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-heading" style={{ color: '#2C1E1E' }}>
                  {benefit.title}
                </h3>
                <p className="font-body" style={{ color: '#2C1E1E' }}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5) EL RITUAL 3 PASOS */}
      <section id="ritual" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ color: '#2C1E1E' }}>
              El Ritual 3 Pasos
            </h2>
          </motion.div>

          <div className="space-y-8">
            {ritualSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2"
                style={{ borderColor: '#D7BFA3' }}
              >
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-heading text-white"
                  style={{ backgroundColor: '#2C1E1E' }}
                >
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-heading" style={{ color: '#2C1E1E' }}>
                      {step.title}
                    </h3>
                    <span className="text-sm font-body px-3 py-1 rounded-full" style={{ backgroundColor: '#F88379', color: 'white' }}>
                      {step.time}
                    </span>
                  </div>
                  <p className="font-body text-lg" style={{ color: '#2C1E1E' }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nota Legal */}
          <p className="text-sm font-body text-center mt-8 italic" style={{ color: '#2C1E1E88' }}>
            El fenogreco se usa tradicionalmente en masajes; no es medicamento.
            Resultados y tiempos pueden variar.
          </p>

          {/* Micro CTA */}
          <div className="text-center mt-8">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#E64A7B' }}
            >
              <Play className="w-4 h-4" />
              Ver video 45s
            </button>
          </div>
        </div>
      </section>

      {/* 6) ANTES/DESPUÉS & PRUEBA SOCIAL */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ color: '#2C1E1E' }}>
              Resultados Reales
            </h2>
          </motion.div>

          {/* Testimonios */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-body font-bold" style={{ color: '#2C1E1E' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm font-body" style={{ color: '#2C1E1E88' }}>
                      {testimonial.city} · Talla {testimonial.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#F88379' }} />
                  ))}
                </div>
                <p className="font-body" style={{ color: '#2C1E1E' }}>
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) LO QUE INCLUYE EL KIT */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ color: '#2C1E1E' }}>
              Lo que Incluye el Kit
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {kitIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border-2 hover:shadow-xl transition-shadow"
                style={{ borderColor: '#D7BFA3' }}
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-heading mb-3" style={{ color: '#2C1E1E' }}>
                  {item.title}
                </h3>
                <p className="font-body mb-3" style={{ color: '#2C1E1E' }}>
                  {item.description}
                </p>
                <p className="text-2xl font-heading font-bold" style={{ color: '#F88379' }}>
                  ${item.price.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Valor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 rounded-2xl"
            style={{ backgroundColor: '#F8837922' }}
          >
            <h3 className="text-2xl font-heading mb-6" style={{ color: '#2C1E1E' }}>
              Si compras por separado:
            </h3>

            <div className="space-y-2 mb-6">
              {kitIncludes.map((item, index) => (
                <p key={index} className="text-lg font-body line-through" style={{ color: '#2C1E1E88' }}>
                  {item.title}: ${item.price.toLocaleString()}
                </p>
              ))}
              <div className="border-t-2 pt-3 mt-3" style={{ borderColor: '#2C1E1E22' }}>
                <p className="text-xl font-body font-bold line-through" style={{ color: '#2C1E1E' }}>
                  Total: ${kitIncludes.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-4xl font-heading mb-4" style={{ color: '#F88379' }}>
              Precio del Kit: ${product.price.toLocaleString()}
            </p>
            <p className="text-xl font-body font-bold" style={{ color: '#2C1E1E' }}>
              Ahorras ${(kitIncludes.reduce((sum, item) => sum + item.price, 0) - product.price).toLocaleString()} (51%)
            </p>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 py-4 px-12 rounded-full font-body font-bold text-lg text-white shadow-xl"
              style={{ backgroundColor: '#F88379' }}
            >
              Quiero mi Kit
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 8) GUÍA DE TALLAS */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-heading mb-4" style={{ color: '#2C1E1E' }}>
              Guía de Tallas
            </h2>
          </motion.div>

          {/* Tabla de Tallas */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
            <table className="w-full">
              <thead style={{ backgroundColor: '#2C1E1E', color: 'white' }}>
                <tr>
                  <th className="py-4 px-6 text-left font-body">Talla</th>
                  <th className="py-4 px-6 text-left font-body">Cintura (cm)</th>
                  <th className="py-4 px-6 text-left font-body">Cadera (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '60-70', '85-95'],
                  ['S', '70-75', '95-100'],
                  ['M', '75-80', '100-105'],
                  ['L', '80-85', '105-110'],
                  ['XL', '85-90', '110-115'],
                  ['2XL', '90-95', '115-120']
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="py-4 px-6 font-body font-semibold" style={{ color: '#2C1E1E' }}>{row[0]}</td>
                    <td className="py-4 px-6 font-body" style={{ color: '#2C1E1E' }}>{row[1]}</td>
                    <td className="py-4 px-6 font-body" style={{ color: '#2C1E1E' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 mb-8 text-center max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <motion.p
                className="font-body text-lg"
                style={{ color: '#2C1E1E' }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
              >
                {['Si', 'buscas', 'mayor', 'realce,', 'elige', 'la', 'menor'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className={word === 'menor' ? 'font-bold' : ''}
                    style={{ display: 'inline-block', marginRight: '0.3rem' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>

              <motion.p
                className="font-body text-lg"
                style={{ color: '#2C1E1E' }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.6
                    }
                  }
                }}
              >
                {['Si', 'buscas', 'para', 'comodidad', 'diaria,', 'la', 'mayor'].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className={word === 'mayor' ? 'font-bold' : ''}
                    style={{ display: 'inline-block', marginRight: '0.3rem' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            </div>
          </motion.div>

          {/* Calculadora */}
          <AnimatePresence>
            {showSizeGuide ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-heading mb-6" style={{ color: '#2C1E1E' }}>
                  Calcula tu talla
                </h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-body mb-2" style={{ color: '#2C1E1E' }}>
                      Cintura (cm)
                    </label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 font-body"
                      style={{ borderColor: '#D7BFA3' }}
                      placeholder="Ej: 75"
                    />
                  </div>
                  <div>
                    <label className="block font-body mb-2" style={{ color: '#2C1E1E' }}>
                      Cadera (cm)
                    </label>
                    <input
                      type="number"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 font-body"
                      style={{ borderColor: '#D7BFA3' }}
                      placeholder="Ej: 100"
                    />
                  </div>
                </div>
                {calculateSize() && (
                  <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#F8837922' }}>
                    <p className="font-body mb-2" style={{ color: '#2C1E1E' }}>Tu talla sugerida:</p>
                    <p className="text-4xl font-heading" style={{ color: '#F88379' }}>
                      {calculateSize()}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="w-full py-4 rounded-full font-body font-bold text-white shadow-lg"
                style={{ backgroundColor: '#2C1E1E' }}
              >
                Calcula tu talla
              </button>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 9) DIFERENCIALES ESBELTA */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ color: '#2C1E1E' }}>
              ¿Por qué Esbelta?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Diseño invisible',
                text: 'Hecho para uso diario e invisible bajo ropa'
              },
              {
                icon: Award,
                title: 'Calidad premium',
                text: 'Paleta y diseño pensados para verse premium, no deportivo'
              },
              {
                icon: MessageCircle,
                title: 'Soporte humano',
                text: 'Política de cambios y soporte vía WhatsApp'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 items-start p-6 rounded-2xl"
                style={{ backgroundColor: '#FBF7F4' }}
              >
                <div className="flex-shrink-0 p-3 rounded-full" style={{ backgroundColor: '#D7BFA3' }}>
                  <item.icon className="w-6 h-6" style={{ color: '#2C1E1E' }} />
                </div>
                <div>
                  <h3 className="text-xl font-heading mb-2" style={{ color: '#2C1E1E' }}>
                    {item.title}
                  </h3>
                  <p className="font-body" style={{ color: '#2C1E1E' }}>
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10) OFERTA DE LANZAMIENTO */}
      <section className="py-16 px-4" style={{ backgroundColor: '#F88379' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-heading text-white mb-6">
              Lanzamiento - 51%
            </h2>

            {/* Countdown */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { label: 'Horas', value: countdown.hours },
                { label: 'Minutos', value: countdown.minutes },
                { label: 'Segundos', value: countdown.seconds }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 min-w-[100px]">
                  <div className="text-4xl font-heading mb-2" style={{ color: '#2C1E1E' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm font-body" style={{ color: '#2C1E1E' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-5 px-16 rounded-full font-body font-bold text-2xl shadow-2xl"
              style={{ backgroundColor: '#2C1E1E', color: 'white' }}
            >
              Aprovechar ahora
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 11) FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading" style={{ color: '#2C1E1E' }}>
              Preguntas Frecuentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border-2 overflow-hidden"
                style={{ borderColor: '#D7BFA3' }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-body font-bold text-lg" style={{ color: '#2C1E1E' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    style={{ color: '#2C1E1E' }}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 font-body" style={{ color: '#2C1E1E' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12) CIERRE CON CTA + GARANTÍAS */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FBF7F4' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-heading" style={{ color: '#2C1E1E' }}>
              Prueba el Kit Esbelta 7 días
            </h2>
            <p className="text-xl font-body" style={{ color: '#2C1E1E' }}>
              Si no te enamora, te ayudamos con el cambio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-8 rounded-full font-body font-bold text-lg text-white shadow-xl"
                style={{ backgroundColor: '#F88379' }}
              >
                Comprar Kit
              </motion.button>

              <motion.a
                href="https://wa.me/573147404023?text=Hola! Quiero información sobre el Kit Esbelta"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-8 rounded-full font-body font-bold text-lg border-2 flex items-center justify-center gap-2 hover:bg-white transition-colors"
                style={{ borderColor: '#2C1E1E', color: '#2C1E1E' }}
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </motion.a>
            </div>

            {/* Garantías finales */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              {[
                { icon: Shield, text: '7 días de garantía' },
                { icon: Truck, text: 'Envios protegido' },
                { icon: CreditCard, text: 'Pago seguro' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-full" style={{ backgroundColor: '#D7BFA3' }}>
                    <item.icon className="w-6 h-6" style={{ color: '#2C1E1E' }} />
                  </div>
                  <p className="font-body font-semibold" style={{ color: '#2C1E1E' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/573147404023?text=Hola! Tengo dudas sobre el Kit Esbelta"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-8 h-8" />
      </motion.a>
    </div>
  );
};

export default ShortInvisibleLandingNew;
