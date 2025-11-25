import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, RefreshCw, Sparkles, ShoppingCart, Shield, Star,
  ChevronDown, Play, Award, CreditCard, Mic, X, Camera, Bot, Trash2, ArrowLeft, ArrowRight, Package
} from 'lucide-react';
import Header from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistantLanding';
import { VirtualTryOn } from '../components/VirtualTryOnLanding';
import EPaycoCheckout from '../components/EPaycoCheckout';
import RitualVideoSection from '../components/RitualVideoSection';
import CartLandingModal from '../components/CartLandingModal';
import OptimizedImage from '../components/OptimizedImage';
import { getDepartments, getCitiesByDepartment, isMedellinCity, isAntioquiaCity, SHIPPING_COSTS } from '../data/colombianLocations';
import { createOrder } from '../services/orderService';
import './ShortInvisibleLandingReact.css';

// ... (Data arrays remain the same) ...
const clientTestimonials = [
  { name: 'Carolina M.', city: 'Barranquilla', size: 'M', comment: 'Increíble cómo realza sin ser incómodo, perfecto para usar todo el día', rating: 5, video: '/landing-short-invisible/videos/testimonio-carolina.mp4' },
  { name: 'Valentina S.', city: 'Cartagena', size: 'S', comment: 'Me encanta que no se marca bajo la ropa, se siente super natural', rating: 5, video: '/landing-short-invisible/videos/testimonio-valentina.mp4' },
  { name: 'Natalia R.', city: 'Medellín', size: 'L', comment: 'La mejor inversión que he hecho, me siento increíble con este short', rating: 5, video: '/landing-short-invisible/videos/comentarios-1.mp4' },
  { name: 'Laura G.', city: 'Bogotá', size: 'M', comment: 'El short es súper cómodo y realmente levanta, lo recomiendo 100%', rating: 5, video: '/landing-short-invisible/videos/comentarios-2.mp4' },
  { name: 'María F.', city: 'Cali', size: 'S', comment: 'Estoy encantada con los resultados, mi figura se ve espectacular', rating: 5, video: '/landing-short-invisible/videos/comentarios-3.mp4' },
  { name: 'Alejandra T.', city: 'Bogotá', size: 'M', comment: 'El short invisible es increíble, me encanta cómo se ve y se siente', rating: 5, video: '/landing-short-invisible/videos/cortro-4.mp4' },
  { name: 'Isabel M.', city: 'Medellín', size: 'L', comment: 'El producto superó todas mis expectativas, me siento espectacular', rating: 5, video: '/landing-short-invisible/videos/cortro-5.mp4' },
  { name: 'Sofía P.', city: 'Barranquilla', size: 'S', comment: 'Me fascina la calidad y el diseño invisible, es perfecto para el día a día', rating: 5, video: '/landing-short-invisible/videos/testimonio-img-1386.mp4' }
];

const faqs = [
  { q: '¿Se marca bajo ropa?', a: 'Diseñado para ser invisible; elige tu talla correcta para mejores resultados.' },
  { q: '¿Pica el exfoliante?', a: 'Fórmula suave; evita usar en piel irritada/lastimada.' },
  { q: '¿Fenogreco aumenta músculo?', a: 'Ayuda como parte de masaje + entrenamiento y nutrición adecuados; no es un medicamento. Resultados pueden variar.' },
  { q: '¿Cómo lavo el short?', a: 'A mano, agua fría, secado a la sombra para mantener la calidad.' },
  { q: '¿Cuánto tarda el envío?', a: 'Envio maximo 72 horas dependera de la ciudad en la que te encuentres' }
];

function ShortInvisibleLandingReact() {
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

  // Estados del carrito y checkout
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartStep, setCartStep] = useState(1);

  // Estado para selección de producto
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('negro');

  // Estado para información de envío
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    fullAddress: '',
    department: '',
    city: '',
    postalCode: ''
  });

  const [shippingErrors, setShippingErrors] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [isMedellin, setIsMedellin] = useState(false); 
  const [isAntioquia, setIsAntioquia] = useState(false);

  // Estados para procesamiento de órdenes
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const sizeAdviceRef = useRef(null);
  const testimonialVideoRefs = useRef([]);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Memoized handler to prevent Header re-renders on countdown tick
  const handleCartOpen = useCallback(() => {
    setShowCart(true);
  }, []);

  // ... (Rest of effects and functions remain identical to previous version) ...
  // Actualizar ciudades disponibles cuando cambia el departamento
  useEffect(() => {
    if (shippingInfo.department) {
      const cities = getCitiesByDepartment(shippingInfo.department);
      setAvailableCities(cities);
      setShippingInfo(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [shippingInfo.department]);

  // Actualizar costo de envío cuando cambia la ciudad
  useEffect(() => {
    if (shippingInfo.city) {
      if (isAntioquiaCity(shippingInfo.city, shippingInfo.department)) {
        setShippingCost(SHIPPING_COSTS.ANTIOQUIA_CONTRA_ENTREGA);
        setIsAntioquia(true);
        setIsMedellin(isMedellinCity(shippingInfo.city)); 
      } else {
        setShippingCost(SHIPPING_COSTS.OTRAS_CIUDADES);
        setIsAntioquia(false);
        setIsMedellin(false);
      }
    } else {
      setShippingCost(0);
      setIsAntioquia(false);
      setIsMedellin(false);
    }
  }, [shippingInfo.city, shippingInfo.department]);

  // COUNTDOWN TIMER
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

  // SCROLL ANIMATIONS
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

  // TESTIMONIAL VIDEO AUTOPLAY
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            if (!video.src && video.dataset.src) {
              video.src = video.dataset.src;
              video.load();
            }
            video.play().catch(err => {
              console.log('Autoplay bloqueado:', err);
            });
          } else if (entry.intersectionRatio < 0.25) {
            video.pause();
          }
        });
      },
      {
        threshold: [0, 0.25, 0.75, 1.0],
        rootMargin: '50px'
      }
    );

    const testimonialVideos = document.querySelectorAll('.testimonial-video');
    testimonialVideos.forEach((video, index) => {
      if (index < 3) {
        videoObserver.observe(video);
      }
    });

    return () => videoObserver.disconnect();
  }, []);

  // SIZE ADVICE WORD ANIMATION
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

  // VOICE ASSISTANT TOOLTIP
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowVoiceTooltip(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowVoiceTooltip(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // ... (Rest of functions: toggleFAQ, calculateSize, cart logic, payment logic) ...
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
    setCartStep(1);
    setShowCart(true);
  };

  const confirmarSeleccion = () => {
    const kitCompleto = {
      id: 'kit-short-invisible',
      name: 'Kit Short Invisible Completo',
      price: 89990,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      image: '/landing-short-invisible/images/productos/short-invisible.jpg',
      description: 'Incluye: Short Invisible + Exfoliante + Aceite de Fenogreco'
    };
    setCart([kitCompleto]);
    setCartStep(2);
  };

  const eliminarDelCarrito = (itemId, itemSize) => {
    setCart(cart.filter(item => !(item.id === itemId && item.size === itemSize)));
  };

  const actualizarCantidad = (itemId, itemSize, newQuantity) => {
    if (newQuantity < 1) {
      eliminarDelCarrito(itemId, itemSize);
      return;
    }
    const updatedCart = cart.map(item =>
      item.id === itemId && item.size === itemSize
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
  };

  const calcularTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateShippingForm = () => {
    const errors = {};
    if (!shippingInfo.fullName.trim()) errors.fullName = 'Nombre requerido';
    if (!shippingInfo.email.trim()) errors.email = 'Email requerido';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) errors.email = 'Email inválido';
    if (!shippingInfo.phone.trim()) errors.phone = 'Teléfono requerido';
    if (!shippingInfo.department) errors.department = 'Departamento requerido';
    if (!shippingInfo.city) errors.city = 'Ciudad requerida';
    if (!shippingInfo.fullAddress.trim()) errors.fullAddress = 'Dirección requerida';
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'Código postal requerido';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setCartStep(3);
    }
  };

  const handleConfirmContraEntrega = async () => {
    if (!validateShippingForm()) {
      return;
    }
    setIsProcessingOrder(true);
    setOrderError(null);
    try {
      const subtotal = calcularTotal();
      const totalFinal = calcularTotalConEnvio();
      const orderData = {
        cart,
        shippingInfo,
        subtotal,
        shippingCost: subtotal > 200000 ? 0 : shippingCost,
        total: totalFinal,
        isMedellin: isMedellin,
        isAntioquia: isAntioquia,
        paymentMethod: 'contra_entrega'
      };
      const result = await createOrder(orderData);
      if (result.success) {
        setOrderSuccess(true);
        alert(`¡Pedido confirmado! 🎉\n\nReferencia: ${result.reference}\n\nRecibirás un correo de confirmación con todos los detalles.\n\nTe contactaremos pronto para coordinar la entrega.`);
        setTimeout(() => {
          setCart([]);
          setShowCart(false);
          setCartStep(1);
          setShippingInfo({
            fullName: '',
            email: '',
            phone: '',
            fullAddress: '',
            department: '',
            city: '',
            postalCode: ''
          });
          setOrderSuccess(false);
        }, 2000);
      } else {
        throw new Error(result.error || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setOrderError(error.message || 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
      alert('Hubo un problema al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const calcularTotalConEnvio = () => {
    const subtotal = calcularTotal();
    const costoEnvio = subtotal > 200000 ? 0 : shippingCost;
    return subtotal + costoEnvio;
  };

  const handlePaymentSuccess = (paymentData) => {
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
    setCartStep(1);
    setShippingInfo({
      fullName: '',
      email: '',
      phone: '',
      fullAddress: '',
      department: '',
      city: '',
      postalCode: ''
    });
    alert('¡Pago exitoso! 🎉\n\nGracias por tu compra. Recibirás un correo de confirmación pronto.');
  };

  const handlePaymentError = (error) => {
    console.error('Error en el pago:', error);
    alert('Hubo un problema con el pago. Por favor intenta nuevamente.');
  };

  const scrollToRitual = () => {
    document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate total items for the header badge
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="font-body bg-white overflow-x-hidden pt-16">
      {/* HEADER GLOBAL (REPLACES FIXED TOP BAR & LOGO SECTION) */}
      <Header 
        onCartOpen={handleCartOpen} 
        customCartCount={totalCartItems}
      />

      {/* MARKETING BAR (STATIC, BELOW HEADER) */}
      <div className="w-full py-3 px-4 text-center bg-esbelta-chocolate text-esbelta-cream">
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
              Kit Oferta 51% HOY
            </span>
          </p>
        </div>
      </div>

      {/* HERO */}
      <section className="pb-16 px-4 bg-esbelta-sand">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            {/* Imagen */}
            <div className="relative fade-in-on-scroll">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src="/landing-short-invisible/images/hero-short-invisible.png"
                  alt="Kit Esbelta Short Invisible"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 fade-in-on-scroll">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-esbelta-chocolate">
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
                  onClick={() => agregarAlCarrito()}
                  className="w-full py-3 px-6 sm:py-4 sm:px-8 rounded-full font-body font-bold text-base sm:text-lg text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#E64A7B' }}
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  Comprar Kit ahora
                </button>

                {/* Botón Prueba Virtual */}
                <button
                  onClick={() => setShowVirtualTryOn(true)}
                  className="w-full py-3 px-6 sm:py-4 sm:px-8 rounded-full font-body font-bold text-base sm:text-lg text-esbelta-chocolate bg-white border-2 border-esbelta-chocolate shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                  Prueba y siéntete Esbelta
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={scrollToRitual}
                  className="w-full py-3 text-center font-body font-medium underline hover:no-underline transition-all text-esbelta-chocolate"
                >
                  Ver cómo funciona →
                </button>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 pt-4 border-t border-esbelta-chocolate/20">
                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-esbelta-chocolate">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  <span className="font-body font-semibold">Pago seguro</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-esbelta-chocolate">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  <span className="font-body font-semibold">envio protegido</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-esbelta-chocolate">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
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
            <div className="carousel-container overflow-x-auto pb-4" style={{ scrollBehavior: 'smooth' }}>
              <div className="carousel-track flex gap-6">
                {clientTestimonials.map((testimonial, index) => (
                  <div key={index} className="carousel-card flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] bg-white rounded-2xl p-6 shadow-lg">
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
                    <p className="font-body text-xs leading-tight line-clamp-2 text-esbelta-chocolate">"{testimonial.comment}"</p>
                    {testimonial.video && (
                      <div className="mt-4 rounded-xl overflow-hidden relative group">
                        <video
                          className="testimonial-video cursor-pointer"
                          data-src={testimonial.video}
                          preload={index < 3 ? "metadata" : "none"}
                          loop
                          muted
                          playsInline
                          autoPlay={index < 3}
                          onMouseEnter={(e) => {
                            if (!e.target.src && e.target.dataset.src) {
                              e.target.src = e.target.dataset.src;
                            }
                          }}
                          onPlay={(e) => {
                            e.target.nextElementSibling?.classList.add('hidden');
                          }}
                          onPause={(e) => {
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                          onClick={(e) => {
                            if (!e.target.src && e.target.dataset.src) {
                              e.target.src = e.target.dataset.src;
                              e.target.load();
                            }
                            if (e.target.paused) {
                              e.target.play();
                            } else {
                              e.target.pause();
                            }
                          }}
                        />
                        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 transition-opacity pointer-events-none ${index < 3 ? 'hidden' : ''}`}>
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

      {/* EL RITUAL 3 PASOS */}
      <RitualVideoSection />

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
                { name: 'Ana R.', city: 'Bogotá', size: 'M', img: '/landing-short-invisible/images/cliente1.jpeg', comment: 'Se ve increíble bajo mis jeans, nadie nota que lo llevo puesto' },
                { name: 'María T.', city: 'Medellín', size: 'L', img: '/landing-short-invisible/images/cliente2.jpeg', comment: 'El exfoliante dejó mi piel súper suave, me encanta el ritual completo' },
                { name: 'Juliana Z.', city: 'Cali', size: 'S', img: '/landing-short-invisible/images/cliente3.jpeg', comment: 'Cómodo todo el día, el aceite huele delicioso y mi piel se siente mejor' },
                { name: 'Ana R.', city: 'Bogotá', size: 'M', img: '/landing-short-invisible/images/cliente1.jpeg', comment: 'Se ve increíble bajo mis jeans, nadie nota que lo llevo puesto' },
                { name: 'María T.', city: 'Medellín', size: 'L', img: '/landing-short-invisible/images/cliente2.jpeg', comment: 'El exfoliante dejó mi piel súper suave, me encanta el ritual completo' },
                { name: 'Juliana Z.', city: 'Cali', size: 'S', img: '/landing-short-invisible/images/cliente3.jpeg', comment: 'Cómodo todo el día, el aceite huele delicioso y mi piel se siente mejor' }
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
              <div className="product-card flex-shrink-0 text-center">
                <div className="product-image-frame mb-4 rounded-2xl p-4 border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                  <OptimizedImage
                    src="/landing-short-invisible/images/productos/short-invisible.jpg"
                    alt="Short invisible"
                    className="product-image"
                  />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3" style={{ color: '#2C1E1E' }}>Short invisible</h3>
                <p className="text-xl font-body mb-3" style={{ color: '#2C1E1E' }}>Realce natural, compresión media cómoda, costuras planas</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#F88379' }}>$79.000</p>
              </div>

              <div className="product-card flex-shrink-0 text-center">
                <div className="product-image-frame mb-4 rounded-2xl p-4 border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                  <OptimizedImage
                    src="/landing-short-invisible/images/productos/exfoliante.png"
                    alt="Exfoliante gluteos"
                    className="product-image"
                  />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3" style={{ color: '#2C1E1E' }}>Exfoliante gluteos</h3>
                <p className="text-xl font-body mb-3" style={{ color: '#2C1E1E' }}>Sensación de piel mas liza que reduce la celulitis</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#F88379' }}>$25.000</p>
              </div>

              <div className="product-card flex-shrink-0 text-center">
                <div className="product-image-frame mb-4 rounded-2xl p-4 border-2 hover:shadow-xl transition-shadow" style={{ borderColor: '#D7BFA3' }}>
                  <OptimizedImage
                    src="/landing-short-invisible/images/productos/aceite-fenogreco.png"
                    alt="Aceite de fenogreco"
                    className="product-image"
                  />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3" style={{ color: '#2C1E1E' }}>Aceite de fenogreco</h3>
                <p className="text-xl font-body mb-3" style={{ color: '#2C1E1E' }}>Para masaje, aroma suave y tonificar la piel</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#F88379' }}>$25.000</p>
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

            <p className="text-2xl sm:text-3xl md:text-4xl font-heading mb-4" style={{ color: '#F88379' }}>Precio del Kit: $89.990</p>
            <p className="text-xl font-body font-bold" style={{ color: '#2C1E1E' }}>Ahorras $39.010 (51%)</p>

            <button
              onClick={() => agregarAlCarrito()}
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
              onClick={() => setShowVirtualTryOn(true)}
              className="w-full py-4 px-8 rounded-full font-body font-bold text-lg text-esbelta-chocolate bg-white border-2 border-esbelta-chocolate shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Camera className="w-6 h-6" />
              Prueba y siéntete Esbelta
              <Sparkles className="w-5 h-5" />
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
                  <p className="text-2xl sm:text-3xl md:text-4xl font-heading text-esbelta-coral">{calculatedSize}</p>
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
                  <h3 className="font-heading mb-2 text-esbelta-chocolate" style={{ fontSize: '22px' }}>{item.title}</h3>
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
          <div className="fade-in-on-scroll visible">
            <h2 className="font-heading mb-6" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '36px', lineHeight: '1.15', letterSpacing: '0.2px', color: '#FBF7F4' }}>
              Lanzamiento - 51%
            </h2>

            {/* Countdown */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8">
              <div className="bg-white rounded-2xl p-2 sm:p-3 min-w-[50px] sm:min-w-[60px]">
                <div className="font-bold mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums', color: '#2C1E1E' }}>
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="uppercase text-[9px] sm:text-[11px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600', letterSpacing: '0.08em', color: '#6A5957' }}>
                  Horas
                </div>
              </div>
              <div className="bg-white rounded-2xl p-2 sm:p-3 min-w-[50px] sm:min-w-[60px]">
                <div className="font-bold mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums', color: '#2C1E1E' }}>
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="uppercase text-[9px] sm:text-[11px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600', letterSpacing: '0.08em', color: '#6A5957' }}>
                  Minutos
                </div>
              </div>
              <div className="bg-white rounded-2xl p-2 sm:p-3 min-w-[50px] sm:min-w-[60px]">
                <div className="font-bold mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums', color: '#2C1E1E' }}>
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="uppercase text-[9px] sm:text-[11px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600', letterSpacing: '0.08em', color: '#6A5957' }}>
                  Segundos
                </div>
              </div>
            </div>

            <button
              onClick={() => agregarAlCarrito()}
              className="py-5 px-16 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform bg-esbelta-chocolate text-white"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: '700', letterSpacing: '0.2px' }}
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
                onClick={() => agregarAlCarrito()}
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
                { icon: Star, text: 'Kit Oferta 51% HOY' },
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
          <VoiceAssistant
            apiKey={GEMINI_API_KEY}
            onBuyProduct={(product) => {
              setShowVoiceAssistant(false);
              agregarAlCarrito();
            }}
          />
        </div>
      )}

      {/* Modal Virtual Try-On */}
      {showVirtualTryOn && (
        <VirtualTryOn onClose={() => setShowVirtualTryOn(false)} apiKey={GEMINI_API_KEY} />
      )}

      {/* Botón Flotante del Carrito */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 right-6 z-[9998] bg-gradient-to-r from-esbelta-coral to-esbelta-terracotta text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
          title="Ver carrito"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-esbelta-chocolate text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Modal del Carrito - Flujo 3 Pasos */}
      <CartLandingModal
        showCart={showCart}
        onClose={() => {
          setShowCart(false);
          setCartStep(1);
        }}
        cartStep={cartStep}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        confirmarSeleccion={confirmarSeleccion}
        shippingInfo={shippingInfo}
        setShippingInfo={setShippingInfo}
        shippingErrors={shippingErrors}
        availableCities={availableCities}
        isMedellin={isMedellin}
        isAntioquia={isAntioquia}
        shippingCost={shippingCost}
        handleContinueToPayment={handleContinueToPayment}
        handleConfirmContraEntrega={handleConfirmContraEntrega}
        isProcessingOrder={isProcessingOrder}
        orderSuccess={orderSuccess}
        orderError={orderError}
        setCartStep={setCartStep}
        cart={cart}
        calcularTotal={calcularTotal}
        calcularTotalConEnvio={calcularTotalConEnvio}
        onProceedToCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
        onOpenVirtualTryOn={() => {
          setShowCart(false);
          setShowVirtualTryOn(true);
        }}
      />

      {/* Modal de Checkout con ePayco */}
      {showCheckout && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-heading text-esbelta-chocolate mb-6 text-center">
              Finalizar Compra
            </h2>

            <div className="mb-6 p-4 bg-esbelta-cream rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Productos:</span>
                <span className="font-semibold">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-esbelta-coral border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span>${calcularTotal().toLocaleString('es-CO')}</span>
              </div>
            </div>

            <EPaycoCheckout
              cartItems={cart}
              total={calcularTotalConEnvio()}
              customerInfo={{
                name: shippingInfo.fullName,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                address: shippingInfo.fullAddress,
                city: shippingInfo.city,
                department: shippingInfo.department
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onClose={() => setShowCheckout(false)}
            />

            <p className="text-xs text-gray-500 text-center mt-4">
              Pago seguro procesado por ePayco
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShortInvisibleLandingReact;