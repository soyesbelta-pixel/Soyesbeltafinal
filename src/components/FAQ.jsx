import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Package, Ruler, Truck, CreditCard, RefreshCw, Heart } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState([]);

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'tallas', name: 'Tallas', icon: Ruler },
    { id: 'envios', name: 'Envíos', icon: Truck },
    { id: 'cuidados', name: 'Cuidados', icon: Heart },
    { id: 'pagos', name: 'Pagos', icon: CreditCard },
    { id: 'cambios', name: 'Cambios', icon: RefreshCw }
  ];

  const faqs = {
    general: [
      {
        question: "¿Qué diferencia hay entre las fajas colombianas y otras fajas?",
        answer: "Las fajas colombianas Esbelta están fabricadas con tecnología PowerNet de alta compresión, costuras planas invisibles y diseño ergonómico patentado. Ofrecen mejor moldeo, durabilidad superior y comodidad durante todo el día."
      },
      {
        question: "¿Cuánto tiempo debo usar la faja al día?",
        answer: "Recomendamos empezar con 2-4 horas diarias e ir aumentando gradualmente hasta 8 horas según tu comodidad. Escucha a tu cuerpo y nunca duermas con la faja puesta."
      },
      {
        question: "¿Las fajas ayudan a bajar de peso?",
        answer: "Las fajas moldean y estilizan tu figura instantáneamente. Combinadas con ejercicio y alimentación saludable, pueden ayudar a mantener una mejor postura y consciencia corporal, pero no son un método de pérdida de peso por sí solas."
      },
      {
        question: "¿Puedo usarlas debajo de ropa ajustada?",
        answer: "Sí, nuestras fajas están diseñadas para ser invisibles bajo vestidos y jeans. Las costuras planas y el encaje siliconado evitan marcas y deslizamientos."
      }
    ],
    tallas: [
      {
        question: "¿Cómo elijo mi talla correcta?",
        answer: "Mide tu cintura y cadera con una cinta métrica. Compara con nuestra tabla de tallas. Si estás entre dos tallas, elige la mayor para comodidad o la menor para más compresión. Nuestro asesor virtual puede ayudarte."
      },
      {
        question: "¿Qué pasa si la talla no me queda?",
        answer: "Ofrecemos cambio de talla gratuito en los primeros 15 días. La prenda debe estar sin usar, con etiquetas y en su empaque original. Cubrimos el envío del cambio."
      },
      {
        question: "¿Las tallas son estándar o colombianas?",
        answer: "Manejamos tallaje colombiano que puede diferir de otras marcas. Por eso incluimos medidas exactas en centímetros en cada producto. Revisa siempre nuestra tabla de tallas específica."
      }
    ],
    envios: [
      {
        question: "¿Cuánto tarda el envío?",
        answer: "Envío express: 24-48 horas en principales ciudades. Envío estándar: 3-5 días hábiles a nivel nacional. Recibirás número de rastreo para seguir tu pedido en tiempo real."
      },
      {
        question: "¿El envío es realmente gratis?",
        answer: "Sí, envío gratis en compras superiores a $150.000. Para montos menores, el costo es de $12.000 en ciudades principales y $18.000 en otros destinos."
      },
      {
        question: "¿Hacen envíos internacionales?",
        answer: "Sí, enviamos a USA, España, México y otros países. El tiempo de entrega es de 7-15 días hábiles. Los costos varían según el destino y peso del paquete."
      }
    ],
    cuidados: [
      {
        question: "¿Cómo lavo mi faja?",
        answer: "Lava a mano con agua fría y jabón neutro. No uses blanqueador ni suavizante. No exprimas, presiona suavemente para eliminar exceso de agua. Seca a la sombra, nunca en secadora ni al sol directo."
      },
      {
        question: "¿Cuánto dura una faja con uso regular?",
        answer: "Con cuidado adecuado, nuestras fajas duran 12-18 meses con uso diario. La durabilidad depende del cuidado, frecuencia de uso y lavado. Recomendamos tener 2 fajas para alternar."
      },
      {
        question: "¿Puedo planchar mi faja?",
        answer: "No, nunca planches tu faja. El calor daña las fibras elásticas y puede deformar la prenda. Si tiene arrugas, cuélgala en un lugar ventilado y se alisará naturalmente."
      }
    ],
    pagos: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos todas las tarjetas de crédito/débito, PSE, Efecty, Baloto, transferencia bancaria y pagos contra entrega en ciudades seleccionadas. También PayPal para compras internacionales."
      },
      {
        question: "¿Es seguro comprar en su sitio web?",
        answer: "100% seguro. Usamos encriptación SSL de 256 bits y procesamos pagos a través de pasarelas certificadas PCI DSS. Nunca almacenamos información de tarjetas en nuestros servidores."
      },
      {
        question: "¿Puedo pagar en cuotas?",
        answer: "Sí, ofrecemos pago hasta en 36 cuotas con tarjetas de crédito participantes. También tenemos convenio con Sistecredito para compras a crédito sin tarjeta."
      }
    ],
    cambios: [
      {
        question: "¿Cuál es su política de devoluciones?",
        answer: "30 días de garantía de satisfacción. Si no estás feliz con tu compra, devuélvela sin usar, con etiquetas y empaque original. Reembolso completo o cambio por otro producto."
      },
      {
        question: "¿Cómo inicio un proceso de cambio?",
        answer: "Contacta nuestro servicio al cliente por WhatsApp o email con tu número de orden. Te enviaremos guía de devolución prepagada y coordinamos la recolección en tu domicilio."
      },
      {
        question: "¿Hay productos que no se pueden devolver?",
        answer: "Por higiene, no aceptamos devoluciones de productos usados o sin etiquetas. Nuestras fajas solo se cambian por talla incorrecta y deben conservar su empaque original."
      }
    ]
  };

  const toggleItem = (index) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-esbelta-chocolate-light max-w-2xl mx-auto">
            Encuentra respuestas a las dudas más comunes sobre nuestros productos y servicios
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenItems([]);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white shadow-lg'
                  : 'bg-white text-esbelta-chocolate hover:bg-esbelta-sand-light'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <div
              key={activeCategory}
              className="space-y-4"
            >
              {faqs[activeCategory].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-esbelta-sand-light/30 transition-colors"
                  >
                    <span className="font-semibold text-esbelta-chocolate pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-esbelta-terracotta flex-shrink-0" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-esbelta-chocolate-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        {/* Help CTA */}
        <div className="mt-12 text-center bg-gradient-to-r bg-white rounded-3xl p-8">
          <Package className="w-12 h-12 text-esbelta-terracotta mx-auto mb-4" />
          <h3 className="text-xl font-bold text-esbelta-chocolate mb-2">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-esbelta-chocolate-light mb-6">
            Nuestro equipo está listo para ayudarte con cualquier pregunta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Chatear con Asesor
            </button>
            <button className="btn-secondary">
              Llamar Ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
