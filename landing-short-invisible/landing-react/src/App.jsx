import { useState, useEffect, useRef } from 'react';
import {
  Truck, RefreshCw, Sparkles, ShoppingCart, Shield, Star,
  ChevronDown, Play, Award, CreditCard, Mic, X, Camera, Bot
} from 'lucide-react';
import { VoiceAssistant } from './components/VoiceAssistant';
import { VirtualTryOn } from './components/VirtualTryOn';
import './App.css';

// ================================
// DATA - Testimonios y FAQs
// ================================

const clientTestimonials = [
  { name: 'Carolina M.', city: 'Barranquilla', size: 'M', comment: 'Increíble cómo realza sin ser incómodo, perfecto para usar todo el día', rating: 5, video: '/videos/testimonio-carolina.mp4' },
  { name: 'Valentina S.', city: 'Cartagena', size: 'S', comment: 'Me encanta que no se marca bajo la ropa, se siente super natural', rating: 5, video: '/videos/testimonio-valentina.mp4' },
  { name: 'Alejandra T.', city: 'Bogotá', size: 'M', comment: 'El short invisible es increíble, me encanta cómo se ve y se siente', rating: 5, video: '/videos/cortro-4.mp4' }
];

const faqs = [
  { q: '¿Se marca bajo ropa?', a: 'Diseñado para ser invisible; elige tu talla correcta para mejores resultados.' },
  { q: '¿Pica el exfoliante?', a: 'Fórmula suave; evita usar en piel irritada/lastimada.' },
  { q: '¿Fenogreco aumenta músculo?', a: 'Ayuda como parte de masaje + entrenamiento y nutrición adecuados; no es un medicamento. Resultados pueden variar.' },
  { q: '¿Cómo lavo el short?', a: 'A mano, agua fría, secado a la sombra para mantener la calidad.' },
  { q: '¿Cuánto tarda el envío?', a: 'Envio maximo 72 horas dependera de la ciudad en la que te encuentres' }
];

function App() {
  // ================================
  // STATE MANAGEMENT
  // ================================

  const [countdown, setCountdown] = useState({ hours: 48, minutes: 0, seconds: 0 });
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [calculatedSize, setCalculatedSize] = useState('');
  const [sizeAdviceAnimated, setSizeAdviceAnimated] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  const sizeAdviceRef = useRef(null);

  // API key para el asistente de voz (desde variables de entorno)
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // ================================
  // COUNTDOWN TIMER
  // ================================

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

  // ================================
  // SCROLL ANIMATIONS
  // ================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ================================
  // SIZE ADVICE WORD ANIMATION
  // ================================

  useEffect(() => {
    if (!sizeAdviceRef.current || sizeAdviceAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !sizeAdviceAnimated) {
            setSizeAdviceAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sizeAdviceRef.current);

    return () => observer.disconnect();
  }, [sizeAdviceAnimated]);

  // ================================
  // VOICE ASSISTANT TOOLTIP
  // ================================

  useEffect(() => {
    // Mostrar tooltip después de 2 segundos de cargar la página
    const showTimer = setTimeout(() => {
      setShowVoiceTooltip(true);
    }, 2000);

    // Ocultar tooltip después de 8 segundos
    const hideTimer = setTimeout(() => {
      setShowVoiceTooltip(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);


  // ================================
  // FUNCTIONS
  // ================================

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const calculateSize = () => {
    const waistNum = parseInt(waist);
    const hipsNum = parseInt(hips);

    if (waistNum && hipsNum) {
      let size = '2XL';
      if (waistNum <= 70 && hipsNum <= 95) size = 'XS';
      else if (waistNum <= 75 && hipsNum <= 100) size = 'S';
      else if (waistNum <= 80 && hipsNum <= 105) size = 'M';
      else if (waistNum <= 85 && hipsNum <= 110) size = 'L';
      else if (waistNum <= 90 && hipsNum <= 115) size = 'XL';

      setCalculatedSize(size);
    }
  };

  const agregarAlCarrito = () => {
    alert('¡Kit agregado al carrito! 🛍️\n\nEn la versión final, esto se integrará con tu sistema de pagos.');
  };

  const scrollToRitual = () => {
    document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ================================
  // RENDER
  // ================================

  return (
    <div className="font-body bg-white overflow-x-hidden">
      {/* LOGO ESBELTA */}
      <div className="py-4 px-4 bg-white fade-in-on-scroll">
        <div className="container mx-auto flex justify-center">
          <img
            src="/images/logo-esbelta.png"
            alt="Esbelta - Fajas Colombianas Premium"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* BARRA SUPERIOR FIJA */}
      <div className="sticky top-0 left-0 right-0 z-50 py-3 px-4 text-center bg-esbelta-chocolate text-esbelta-cream">
        <div className="container mx-auto">
          <p className="font-body text-sm md:text-base font-medium flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Envío a todo Colombia
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Pago seguro
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="w-4 h-4" />
              Promo lanzamiento 51% hoy
            </span>
          </p>
        </div>
      </div>

      {/* HERO */}
      <section className="pb-16 px-4 bg-esbelta-sand">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Imagen */}
            <div className="relative fade-in-on-scroll">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-short-invisible.png"
                  alt="Kit Esbelta Short Invisible"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 fade-in-on-scroll">
              <h1 className="font-heading text-5xl md:text-6xl leading-tight text-esbelta-chocolate">
                Glúteo con forma en 2 minutos.
              </h1>

              <p className="font-body text-lg leading-relaxed text-esbelta-chocolate">
                <strong>Kit Esbelta:</strong> short levanta-glúteo invisible + exfoliante para piel más lisa +
                aceite de fenogreco para masaje y tonificación. Ritual 3 pasos, resultados visibles en tu outfit.
                <span className="text-sm italic"> Resultados pueden variar.</span>
              </p>

              {/* CTAs */}
              <div className="space-y-4">
                <button
                  onClick={agregarAlCarrito}
                  className="w-full py-4 px-8 rounded-full font-body font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 bg-esbelta-coral"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Comprar Kit ahora
                </button>

                {/* Botón Prueba Virtual */}
                <button
                  onClick={() => setShowVirtualTryOn(true)}
                  className="w-full py-4 px-8 rounded-full font-body font-bold text-lg text-esbelta-chocolate bg-white border-2 border-esbelta-chocolate shadow-glow hover:shadow-glow-strong transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Camera className="w-6 h-6" />
                  Prueba y siéntete Esbelta
                  <Sparkles className="w-5 h-5" />
                </button>

                <button
                  onClick={scrollToRitual}
                  className="w-full py-3 text-center font-body font-medium underline hover:no-underline transition-all text-esbelta-chocolate"
                >
                  Ver cómo funciona →
                </button>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-esbelta-chocolate/20">
                <div className="flex items-center gap-2 text-base md:text-lg text-esbelta-chocolate">
                  <Shield className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">Pago seguro</span>
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg text-esbelta-chocolate">
                  <Truck className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">envio protegido</span>
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg text-esbelta-chocolate">
                  <CreditCard className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-body font-semibold">Compra inteligente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL CAROUSEL */}
      <section className="py-16 px-4 overflow-hidden bg-esbelta-cream">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading mb-3 text-esbelta-chocolate">
              Decenas de clientas felices
            </h2>
            <p className="text-lg font-body text-esbelta-chocolate/50">
              Las fotos son 100% reales y no tienen edicion magica
            </p>
          </div>

          {/* Carrusel */}
          <div className="relative">
            <div className="carousel-container overflow-hidden">
              <div className="carousel-track flex gap-6 animate-scroll">
                {[...clientTestimonials, ...clientTestimonials].map((testimonial, index) => (
                  <div key={index} className="carousel-card flex-shrink-0 w-[350px] bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl gradient-chocolate-beige">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-body font-bold text-base text-esbelta-chocolate">{testimonial.name}</h4>
                        <p className="text-sm font-body text-esbelta-chocolate/50">{testimonial.city} · Talla {testimonial.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-esbelta-coral" />
                      ))}
                    </div>
                    <p className="font-body text-sm leading-relaxed text-esbelta-chocolate">"{testimonial.comment}"</p>
                    {testimonial.video && (
                      <div className="mt-4 rounded-xl overflow-hidden relative group">
                        <video
                          className="testimonial-video cursor-pointer"
                          src={testimonial.video}
                          loop
                          muted
                          playsInline
                          onPlay={(e) => {
                            e.target.nextElementSibling?.classList.add('hidden');
                          }}
                          onPause={(e) => {
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                          onClick={(e) => {
                            if (e.target.paused) {
                              e.target.play();
                            } else {
                              e.target.pause();
                            }
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 transition-opacity pointer-events-none">
                          <div className="px-4 py-2 rounded-lg bg-white bg-opacity-80 backdrop-blur-sm">
                            <p className="text-xs font-body text-esbelta-chocolate/70">Click para reproducir</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 px-4 bg-esbelta-cream">
        <div className="container mx-auto max-w-5xl">
          {/* Carrusel de Beneficios */}
          <div className="benefits-carousel-container overflow-x-auto mb-8">
            <div className="benefits-carousel flex gap-8 pb-4">
              <div className="benefit-card flex-shrink-0 text-center space-y-4 fade-in-on-scroll">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/images/beneficios/short-invisible.png"
                    alt="Glúteo con forma, sin truco"
                    className="benefit-image benefit-image-short"
                  />
                </div>
                <h3 className="text-xl font-heading text-esbelta-chocolate">Glúteo con forma, sin truco</h3>
                <p className="font-body text-esbelta-chocolate">realce natural y no se nota bajo la ropa</p>
              </div>

              <div className="benefit-card flex-shrink-0 text-center space-y-4 fade-in-on-scroll">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/images/beneficios/exfoliante.png"
                    alt="Piel más lisa a la vista"
                    className="benefit-image"
                  />
                </div>
                <h3 className="text-xl font-heading text-esbelta-chocolate">Piel más lisa a la vista</h3>
                <p className="font-body text-esbelta-chocolate">con uso constante, ayuda a reducir la apariencia de la celulitis.</p>
              </div>

              <div className="benefit-card flex-shrink-0 text-center space-y-4 fade-in-on-scroll">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/images/beneficios/aceite-masaje.png"
                    alt="Activa y acompaña"
                    className="benefit-image"
                  />
                </div>
                <h3 className="text-xl font-heading text-esbelta-chocolate">Activa y acompaña</h3>
                <p className="font-body text-esbelta-chocolate">aceite de fenogreco para potenciar el crecimiento del glúteo si eres constante</p>
              </div>
            </div>
          </div>

          {/* Indicador de scroll para mobile */}
          <p className="text-center text-sm font-body mb-8 md:hidden" style={{ color: '#2C1E1E88' }}>
            ← Desliza para ver todos los beneficios →
          </p>
        </div>
      </section>

      {/* EL RITUAL 3 PASOS */}
      <section id="ritual" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-esbelta-chocolate">El Ritual 3 Pasos</h2>
          </div>

          <div className="space-y-8">
            {[
              { num: 1, title: 'Exfolia', time: '30–60s', desc: 'Ducha + exfoliante, movimientos circulares' },
              { num: 2, title: 'Masajea', time: '60–90s', desc: 'Aceite de fenogreco, de abajo hacia arriba' },
              { num: 3, title: 'Coloca', time: '30s', desc: 'Short invisible, look listo' }
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start bg-white rounded-2xl p-6 border-2 border-esbelta-sand fade-in-on-scroll">
                <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-heading text-white bg-esbelta-chocolate">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-heading text-esbelta-chocolate">{step.title}</h3>
                    <span className="text-sm font-body px-3 py-1 rounded-full bg-esbelta-coral text-white">{step.time}</span>
                  </div>
                  <p className="font-body text-lg text-esbelta-chocolate">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm font-body text-center mt-8 italic text-esbelta-chocolate/50">
            El fenogreco se usa tradicionalmente en masajes; no es medicamento. Resultados y tiempos pueden variar.
          </p>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-esbelta-rose">
              <Play className="w-4 h-4" />
              Ver video 45s
            </button>
          </div>
        </div>
      </section>

      {/* RESULTADOS REALES */}
      <section className="py-16 px-4 bg-esbelta-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-esbelta-chocolate">Resultados Reales</h2>
          </div>

          {/* Carrusel con scroll horizontal */}
          <div className="results-carousel-container overflow-x-auto">
            <div className="results-carousel flex gap-8 pb-4">
              {[
                { name: 'Ana R.', city: 'Bogotá', size: 'M', img: '/images/cliente1.jpeg', comment: 'Se ve increíble bajo mis jeans, nadie nota que lo llevo puesto' },
                { name: 'María T.', city: 'Medellín', size: 'L', img: '/images/cliente2.jpeg', comment: 'El exfoliante dejó mi piel súper suave, me encanta el ritual completo' },
                { name: 'Juliana Z.', city: 'Cali', size: 'S', img: '/images/cliente3.jpeg', comment: 'Cómodo todo el día, el aceite huele delicioso y mi piel se siente mejor' },
                { name: 'Ana R.', city: 'Bogotá', size: 'M', img: '/images/cliente1.jpeg', comment: 'Se ve increíble bajo mis jeans, nadie nota que lo llevo puesto' },
                { name: 'María T.', city: 'Medellín', size: 'L', img: '/images/cliente2.jpeg', comment: 'El exfoliante dejó mi piel súper suave, me encanta el ritual completo' },
                { name: 'Juliana Z.', city: 'Cali', size: 'S', img: '/images/cliente3.jpeg', comment: 'Cómodo todo el día, el aceite huele delicioso y mi piel se siente mejor' }
              ].map((client, idx) => (
                <div key={idx} className="result-card flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={client.img} alt={client.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h4 className="font-body font-bold text-esbelta-chocolate">{client.name}</h4>
                      <p className="text-sm font-body text-esbelta-chocolate/50">{client.city} · Talla {client.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-esbelta-coral" />
                    ))}
                  </div>
                  <p className="font-body text-esbelta-chocolate">"{client.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Indicador de scroll */}
          <p className="text-center text-sm font-body mt-8" style={{ color: '#2C1E1E88' }}>
            Scroll para ver más testimonios →
          </p>
        </div>
      </section>

      {/* LO QUE INCLUYE EL KIT */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-esbelta-chocolate">Lo que Incluye el Kit</h2>
          </div>

          {/* Carrusel de Productos */}
          <div className="products-carousel-container overflow-x-auto mb-12">
            <div className="products-carousel flex gap-6 pb-4">
              <div className="product-card flex-shrink-0 bg-white rounded-2xl p-8 text-center border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                <div className="mb-4 flex justify-center">
                  <img src="/images/productos/short-invisible.jpg" alt="Short invisible" className="product-image" />
                </div>
                <h3 className="text-xl font-heading mb-3" style={{ color: '#2C1E1E' }}>Short invisible</h3>
                <p className="font-body mb-3" style={{ color: '#2C1E1E' }}>Realce natural, compresión media cómoda, costuras planas</p>
                <p className="text-2xl font-heading font-bold" style={{ color: '#F88379' }}>$79.000</p>
              </div>

              <div className="product-card flex-shrink-0 bg-white rounded-2xl p-8 text-center border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                <div className="mb-4 flex justify-center">
                  <img src="/images/productos/exfoliante.png" alt="Exfoliante gluteos" className="product-image" />
                </div>
                <h3 className="text-xl font-heading mb-3" style={{ color: '#2C1E1E' }}>Exfoliante gluteos</h3>
                <p className="font-body mb-3" style={{ color: '#2C1E1E' }}>Sensación de piel mas liza que reduce la celulitis</p>
                <p className="text-2xl font-heading font-bold" style={{ color: '#F88379' }}>$25.000</p>
              </div>

              <div className="product-card flex-shrink-0 bg-white rounded-2xl p-8 text-center border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                <div className="mb-4 flex justify-center">
                  <img src="/images/productos/aceite-fenogreco.png" alt="Aceite de fenogreco" className="product-image" />
                </div>
                <h3 className="text-xl font-heading mb-3" style={{ color: '#2C1E1E' }}>Aceite de fenogreco</h3>
                <p className="font-body mb-3" style={{ color: '#2C1E1E' }}>Para masaje, aroma suave y tonificar la piel</p>
                <p className="text-2xl font-heading font-bold" style={{ color: '#F88379' }}>$25.000</p>
              </div>
            </div>
          </div>

          {/* Indicador de scroll para mobile */}
          <p className="text-center text-sm font-body mb-8 md:hidden" style={{ color: '#2C1E1E88' }}>
            ← Desliza para ver todos los productos →
          </p>

          {/* Valor */}
          <div className="text-center p-8 rounded-2xl fade-in-on-scroll" style={{ backgroundColor: '#F8837922' }}>
            <h3 className="text-2xl font-heading mb-6" style={{ color: '#2C1E1E' }}>Si compras por separado:</h3>

            <div className="space-y-2 mb-6">
              <p className="text-lg font-body line-through" style={{ color: '#2C1E1E88' }}>Short invisible: $79.000</p>
              <p className="text-lg font-body line-through" style={{ color: '#2C1E1E88' }}>Exfoliante: $25.000</p>
              <p className="text-lg font-body line-through" style={{ color: '#2C1E1E88' }}>Aceite de fenogreco: $25.000</p>
              <div className="border-t-2 pt-3 mt-3" style={{ borderColor: '#2C1E1E22' }}>
                <p className="text-xl font-body font-bold line-through" style={{ color: '#2C1E1E' }}>Total: $129.000</p>
              </div>
            </div>

            <p className="text-4xl font-heading mb-4" style={{ color: '#F88379' }}>Precio del Kit: $89.990</p>
            <p className="text-xl font-body font-bold" style={{ color: '#2C1E1E' }}>Ahorras $39.010 (51%)</p>

            <button
              onClick={agregarAlCarrito}
              className="mt-6 py-4 px-12 rounded-full font-body font-bold text-lg text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
              style={{ backgroundColor: '#F88379' }}
            >
              Quiero mi Kit
            </button>
          </div>
        </div>
      </section>

      {/* GUÍA DE TALLAS */}
      <section className="py-16 px-4 bg-esbelta-cream">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 fade-in-on-scroll">
            <h2 className="text-4xl font-heading mb-4 text-esbelta-chocolate">Guía de Tallas</h2>
          </div>

          {/* Tabla de Tallas */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
            <table className="w-full">
              <thead className="bg-esbelta-chocolate text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-body">Talla</th>
                  <th className="py-4 px-6 text-left font-body">Cintura (cm)</th>
                  <th className="py-4 px-6 text-left font-body">Cadera (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', waist: '60-70', hips: '85-95' },
                  { size: 'S', waist: '70-75', hips: '95-100' },
                  { size: 'M', waist: '75-80', hips: '100-105' },
                  { size: 'L', waist: '80-85', hips: '105-110' },
                  { size: 'XL', waist: '85-90', hips: '110-115' },
                  { size: '2XL', waist: '90-95', hips: '115-120' }
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-4 px-6 font-body font-semibold text-esbelta-chocolate">{row.size}</td>
                    <td className="py-4 px-6 font-body text-esbelta-chocolate">{row.waist}</td>
                    <td className="py-4 px-6 font-body text-esbelta-chocolate">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div ref={sizeAdviceRef} className="mt-6 mb-8 text-center max-w-2xl mx-auto">
            <div className="space-y-2">
              <p className="font-body text-lg text-esbelta-chocolate">
                {sizeAdviceAnimated ? (
                  <>
                    {['Si', 'buscas', 'mayor', 'realce,', 'elige', 'la', 'menor'].map((word, i) => (
                      <>
                        <span
                          key={i}
                          className="word-animate inline-block"
                          style={{ animationDelay: `${i * 0.08}s` }}
                        >
                          {word === 'mayor' || word === 'menor' ? <strong>{word}</strong> : word}
                        </span>{' '}
                      </>
                    ))}
                  </>
                ) : (
                  <>Si buscas <strong>mayor realce</strong>, elige la <strong>menor</strong></>
                )}
              </p>
              <p className="font-body text-lg text-esbelta-chocolate">
                {sizeAdviceAnimated ? (
                  <>
                    {['Si', 'buscas', 'para', 'comodidad', 'diaria,', 'la', 'mayor'].map((word, i) => (
                      <>
                        <span
                          key={i}
                          className="word-animate inline-block"
                          style={{ animationDelay: `${0.6 + i * 0.08}s` }}
                        >
                          {word === 'comodidad' || word === 'diaria,' || word === 'mayor' ? <strong>{word}</strong> : word}
                        </span>{' '}
                      </>
                    ))}
                  </>
                ) : (
                  <>Si buscas para <strong>comodidad diaria</strong>, la <strong>mayor</strong></>
                )}
              </p>
            </div>
          </div>

          {/* Calculadora */}
          {!showSizeCalculator ? (
            <button
              onClick={() => setShowSizeCalculator(true)}
              className="w-full py-4 rounded-full font-body font-bold text-white shadow-lg bg-esbelta-chocolate"
            >
              Calcula tu talla
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg mt-4">
              <h3 className="text-2xl font-heading mb-6 text-esbelta-chocolate">Calcula tu talla</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-body mb-2 text-esbelta-chocolate">Cintura (cm)</label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-esbelta-sand font-body focus:border-esbelta-coral focus:outline-none"
                    placeholder="Ej: 75"
                  />
                </div>
                <div>
                  <label className="block font-body mb-2 text-esbelta-chocolate">Cadera (cm)</label>
                  <input
                    type="number"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-esbelta-sand font-body focus:border-esbelta-coral focus:outline-none"
                    placeholder="Ej: 100"
                  />
                </div>
              </div>
              <button
                onClick={calculateSize}
                className="w-full py-3 rounded-full font-body font-bold text-white bg-esbelta-coral"
              >
                Calcular talla
              </button>
              {calculatedSize && (
                <div className="text-center p-6 rounded-xl mt-4 bg-esbelta-coral/10">
                  <p className="font-body mb-2 text-esbelta-chocolate">Tu talla sugerida:</p>
                  <p className="text-4xl font-heading text-esbelta-coral">{calculatedSize}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ¿POR QUÉ ESBELTA? */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 text-esbelta-chocolate">¿Por qué Esbelta?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Sparkles, title: 'Diseño invisible', desc: 'Hecho para uso diario e invisible bajo ropa' },
              { icon: Award, title: 'Calidad premium', desc: 'Paleta y diseño pensados para verse premium, no deportivo' },
              { icon: Bot, title: 'Soporte personalizado', desc: 'Atención Vía WhatsApp para compras' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start p-6 rounded-2xl fade-in-on-scroll bg-esbelta-cream">
                <div className="flex-shrink-0 p-3 rounded-full bg-esbelta-sand">
                  <item.icon className="w-6 h-6 text-esbelta-chocolate" />
                </div>
                <div>
                  <h3 className="text-xl font-heading mb-2 text-esbelta-chocolate">{item.title}</h3>
                  <p className="font-body text-esbelta-chocolate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA DE LANZAMIENTO - COUNTDOWN */}
      <section className="py-16 px-4 bg-esbelta-coral">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">Lanzamiento - 51%</h2>

            {/* Countdown */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white rounded-2xl p-3 min-w-[60px]">
                <div className="text-4xl font-heading mb-2 text-esbelta-chocolate">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-xs font-body text-esbelta-chocolate">Horas</div>
              </div>
              <div className="bg-white rounded-2xl p-3 min-w-[60px]">
                <div className="text-4xl font-heading mb-2 text-esbelta-chocolate">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs font-body text-esbelta-chocolate">Minutos</div>
              </div>
              <div className="bg-white rounded-2xl p-3 min-w-[60px]">
                <div className="text-4xl font-heading mb-2 text-esbelta-chocolate">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs font-body text-esbelta-chocolate">Segundos</div>
              </div>
            </div>

            <button
              onClick={agregarAlCarrito}
              className="py-5 px-16 rounded-full font-body font-bold text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform bg-esbelta-chocolate text-white"
            >
              Aprovechar ahora
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading text-esbelta-chocolate">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-esbelta-sand overflow-hidden fade-in-on-scroll"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-body font-bold text-lg text-esbelta-chocolate">{faq.q}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-esbelta-chocolate transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-6 font-body text-esbelta-chocolate">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE CON CTA */}
      <section className="py-16 px-4 bg-esbelta-cream">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading text-esbelta-chocolate">Prueba el Kit Esbelta</h2>
            <p className="text-xl font-body text-esbelta-chocolate">Es el complemento perfecto que necesitas</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                onClick={agregarAlCarrito}
                className="flex-1 py-4 px-8 rounded-full font-body font-bold text-lg text-white shadow-xl hover:scale-105 active:scale-95 transition-transform bg-esbelta-coral"
              >
                Comprar Kit
              </button>

              <a
                href="https://wa.me/573147404023?text=Hola! Quiero información sobre el Kit Esbelta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-8 rounded-full font-body font-bold text-lg border-2 border-esbelta-chocolate flex items-center justify-center gap-2 hover:bg-white transition-colors text-esbelta-chocolate"
              >
                <Shield className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
            </div>

            {/* Garantías finales */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              {[
                { icon: Star, text: 'Promo lanzamiento 51% hoy' },
                { icon: Truck, text: 'Envios protegido' },
                { icon: CreditCard, text: 'Pago seguro' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-full bg-esbelta-sand">
                    <item.icon className="w-6 h-6 text-esbelta-chocolate" />
                  </div>
                  <p className="font-body font-semibold text-esbelta-chocolate">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Botón Asistente de Voz - Estilo Siri mejorado */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Tooltip flotante */}
        {showVoiceTooltip && (
          <div className="voice-tooltip absolute bottom-full right-0 mb-4 animate-bounce">
            <div className="bg-white text-esbelta-chocolate px-6 py-3 rounded-2xl shadow-2xl border-2 border-esbelta-sand">
              <p className="text-sm font-semibold whitespace-nowrap">Conversa conmigo directamente 💬</p>
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r-2 border-b-2 border-esbelta-sand"></div>
            </div>
          </div>
        )}

        {/* Botón orbe con anillos */}
        <div className="relative">
          {/* Anillos pulsantes */}
          <div className="voice-ring-1 absolute inset-0 rounded-full border-2 border-esbelta-coral opacity-40"></div>
          <div className="voice-ring-2 absolute inset-0 rounded-full border-2 border-esbelta-coral opacity-30"></div>

          {/* Botón principal */}
          <button
            onClick={() => {
              setShowVoiceAssistant(true);
              setShowVoiceTooltip(false);
            }}
            onMouseEnter={() => setShowVoiceTooltip(false)}
            className="voice-orb-float relative p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #E8967E 0%, #D27C5A 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 30px rgba(210, 124, 90, 0.4)'
            }}
            title="Hablar con asistente de voz"
            aria-label="Abrir asistente de voz"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* Modal Asistente de Voz */}
      {showVoiceAssistant && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50">
          <button
            onClick={() => setShowVoiceAssistant(false)}
            className="absolute top-4 right-4 z-[10000] bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Cerrar asistente"
          >
            <X className="w-6 h-6" />
          </button>
          <VoiceAssistant apiKey={GEMINI_API_KEY} />
        </div>
      )}

      {/* Modal Virtual Try-On */}
      {showVirtualTryOn && (
        <VirtualTryOn onClose={() => setShowVirtualTryOn(false)} apiKey={GEMINI_API_KEY} />
      )}
    </div>
  );
}

export default App;
