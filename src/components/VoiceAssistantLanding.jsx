import { GoogleGenAI, Modality } from '@google/genai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, ShoppingCart, X } from 'lucide-react';
import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM al navegar
import { createBlob, decode, decodeAudioData } from '../utils/landing/audio';

// ============================================
// PRODUCTOS
// ============================================
const PRODUCTS = {
  KIT: {
    id: 'kit',
    name: 'Kit Esbelta Premium',
    description: 'Short + Aceite + Exfoliante',
    price: '$89.990',
    originalPrice: '$129.000',
    discount: '51% OFF',
    image: '/landing-short-invisible/images/hero-short-invisible.png',
  },
  SHORT: {
    id: 'short',
    name: 'Short Invisible Levanta Cola',
    description: 'Moldea y levanta sin costuras visibles',
    price: '$79.000',
    originalPrice: '$89.990',
    discount: '12% OFF',
    image: '/landing-short-invisible/images/productos/short-invisible.jpg',
  },
  EXFOLIANTE: {
    id: 'exfoliante',
    name: 'Exfoliante Corporal',
    description: 'Elimina células muertas y suaviza la piel',
    price: '$25.000',
    originalPrice: '$35.000',
    discount: '29% OFF',
    image: '/landing-short-invisible/images/productos/exfoliante.png',
  },
  ACEITE: {
    id: 'aceite',
    name: 'Aceite de Fenogreco',
    description: 'Reafirma y tonifica con masaje',
    price: '$25.000',
    originalPrice: '$35.000',
    discount: '29% OFF',
    image: '/landing-short-invisible/images/productos/aceite-fenogreco.png',
  }
};

// ============================================
// SYSTEM INSTRUCTION
// ============================================
const SYSTEM_INSTRUCTION = `Eres Sofía, asistente de ventas de Esbelta. Cálida, persuasiva, experta en cerrar ventas.

## ESTILO DE VOZ - MUY IMPORTANTE
Habla con ritmo RÁPIDO y DINÁMICO, como una vendedora entusiasta. No hables lento ni pausado. Mantén un tono enérgico y fluido.

## INICIO OBLIGATORIO - PRIMERO MUESTRA, LUEGO PREGUNTA
Tu PRIMERA respuesta cuando el cliente diga CUALQUIER cosa:
1. Saluda: "¡Hola bella! Soy Sofía, tu asesora de belleza"
2. MUESTRA el Kit: "Mira, te presento nuestro Kit Esbelta [SHOW_KIT]"
3. EXPLICA qué contiene: "Incluye el short levanta cola, el aceite de fenogreco para masajes, y el exfoliante corporal. Son 3 productos premium por solo $89,990 con 51% de descuento"
4. Menciona beneficios: "Te ayuda a realzar sin aplanar, es invisible bajo la ropa"
5. DESPUÉS pregunta: "¿Te gustaría que te cuente más sobre alguno de los productos?"

IMPORTANTE: Primero INFORMA y MUESTRA, luego haz preguntas. No pidas talla de inmediato.

## CUANDO PIDAN VER PRODUCTOS
Si dicen "muéstrame", "ver", "imagen", "foto", "enseñar", "cómo es":
- "Claro bella, mira el Kit completo [SHOW_KIT]"
- "Te muestro el short [SHOW_SHORT], mira qué bonito"
- "Aquí está el aceite de fenogreco [SHOW_ACEITE]"
- "Este es nuestro exfoliante [SHOW_EXFOLIANTE]"
SIEMPRE incluye el trigger cuando te pidan ver algo.

## FLUJO DE CONVERSACIÓN IDEAL
1. SALUDO + MOSTRAR KIT [SHOW_KIT] + explicar contenido
2. ESCUCHAR qué le interesa al cliente
3. MOSTRAR productos específicos según interés [SHOW_SHORT/ACEITE/EXFOLIANTE]
4. EXPLICAR beneficios y cómo usarlos
5. PREGUNTAR talla cuando ya mostró interés real
6. CERRAR con urgencia y WhatsApp

## USO OBLIGATORIO DE TRIGGERS - MUY IMPORTANTE
CADA VEZ que menciones un producto, DEBES incluir su código:
- Kit/oferta/promoción/combo → [SHOW_KIT]
- Short/faja/levanta cola/realzar → [SHOW_SHORT]
- Aceite/fenogreco/masaje/reafirmar → [SHOW_ACEITE]
- Exfoliante/exfoliar/piel/suavizar → [SHOW_EXFOLIANTE]
- Quiere comprar/llevar → [REDIRECT_CHECKOUT]

El cliente VE la imagen cuando dices el código. Si no pones el código, NO ve nada.

## KIT ESBELTA - $89,990 (51% OFF)
3 productos: Short levanta-glúteo ($79k) + Exfoliante ($25k) + Aceite fenogreco ($25k) = Ahorro $39,010
Colores: Negro/Beige | Envío GRATIS Colombia | 7 días garantía | 3-5 días entrega

## TALLAS (preguntar DESPUÉS de mostrar productos)
XS:60-70/85-95 | S:70-75/95-100 | M:75-80/100-105 | L:80-85/105-110 | XL:85-90/110-115 | 2XL:90-95/115-120
Si no sabe su talla: "No te preocupes amor, ¿tienes una cinta métrica? Te ayudo a medirte"
Mayor realce→talla menor | Comodidad→talla mayor

## RITUAL 2 MIN
1.Exfolia (30-60s) | 2.Masajea con aceite (60-90s) | 3.Ponte short (30s)

## BENEFICIOS
Realza sin aplanar | Invisible bajo ropa | Piel suave | Uso diario cómodo | Premium colombiano

## FAQs
¿Se marca? No, talla correcta=invisible
¿Pica exfoliante? No, fórmula suave
¿Fenogreco aumenta? Ayuda con masaje+ejercicio+nutrición (resultados varían)
¿Lavado? A mano, agua fría, sombra
¿Envío? Gratis, 3-5 días hábiles

## TESTIMONIOS
Carolina(M):"Realza sin incomodar" | Valentina(S):"No se marca" | Isabella(XL):"Realza sin aplanar"

## CIERRE
- Urgencia: "Esta promoción del 51% es solo por 48 horas, bella"
- Facilidad: "Envío gratis y tienes 7 días de garantía"
- WhatsApp: +57 314 740 4023 para pedidos

## TONO
Cálida, usa "bella","amor" | Específica con números | Emociona: "Te va a quedar espectacular"

## NUNCA
❌ Pedir talla antes de mostrar productos | ❌ Olvidar los triggers [SHOW_*] | ❌ Promesas médicas | ❌ Presionar agresivamente

Recuerda: PRIMERO muestra y explica, DESPUÉS preguntas. El cliente debe VER los productos.`;

// ============================================
// UTILIDADES
// ============================================
const SessionState = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
};

const detectProductTrigger = (text) => {
  const triggers = {
    '[SHOW_KIT]': 'KIT',
    '[SHOW_SHORT]': 'SHORT',
    '[SHOW_ACEITE]': 'ACEITE',
    '[SHOW_EXFOLIANTE]': 'EXFOLIANTE',
  };

  // Find the LAST trigger mentioned (most recent product)
  let lastTrigger = null;
  let lastIndex = -1;

  for (const [trigger, productKey] of Object.entries(triggers)) {
    const index = text.lastIndexOf(trigger);
    if (index > lastIndex) {
      lastIndex = index;
      lastTrigger = productKey;
    }
  }

  return lastTrigger;
};

// Detecta TODOS los triggers en el texto y los devuelve en orden de aparición
const detectAllProductTriggers = (text) => {
  const triggers = {
    '[SHOW_KIT]': 'KIT',
    '[SHOW_SHORT]': 'SHORT',
    '[SHOW_ACEITE]': 'ACEITE',
    '[SHOW_EXFOLIANTE]': 'EXFOLIANTE',
  };

  const found = [];
  for (const [trigger, productKey] of Object.entries(triggers)) {
    const index = text.indexOf(trigger);
    if (index !== -1) {
      found.push({ productKey, index });
    }
  }

  // Ordenar por posición en el texto (para mostrar en orden de mención)
  return found.sort((a, b) => a.index - b.index).map(f => f.productKey);
};

const cleanTriggers = (text) => {
  return text
    .replace(/\[SHOW_KIT\]/g, '')
    .replace(/\[SHOW_SHORT\]/g, '')
    .replace(/\[SHOW_ACEITE\]/g, '')
    .replace(/\[SHOW_EXFOLIANTE\]/g, '')
    .replace(/\[REDIRECT_CHECKOUT\]/g, '')
    .trim();
};

// ============================================
// COMPONENTE: Header con Avatar "S"
// ============================================
const SofiaHeader = ({ sessionState }) => (
  <header className="flex items-center gap-3 p-4 border-b border-[#EDE9E6]">
    {/* Avatar con iniciales */}
    <div
      className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #C96F7B 0%, #EAD9C8 50%, #F88379 100%)',
        border: '2px solid rgba(255,255,255,0.4)'
      }}
    >
      <span className="text-white font-serif font-bold text-lg">S</span>
      {/* Indicador online */}
      {sessionState === SessionState.ACTIVE && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>

    <div className="flex-1">
      <h1 className="font-serif text-lg font-bold text-[#2C1E1E]">Sofía</h1>
      <p className="text-xs text-[#6D4A40]">
        {sessionState === SessionState.ACTIVE ? 'Escuchando...' :
         sessionState === SessionState.CONNECTING ? 'Conectando...' :
         'Tu asesora personal'}
      </p>
    </div>
  </header>
);

// ============================================
// COMPONENTE: Transcript Minimalista
// ============================================
const MinimalTranscript = ({ transcript, currentInput, currentOutput }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentInput, currentOutput]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[30vh] lg:max-h-[40vh] scrollbar-hide"
      style={{ background: 'linear-gradient(180deg, #FBF7F4 0%, #FFFFFF 100%)' }}
    >
      {transcript.length === 0 && !currentInput && !currentOutput && (
        <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
          {/* Título */}
          <p className="text-[#6D4A40] text-sm font-medium">
            Prueba preguntarle a Sofía:
          </p>

          {/* Tips como chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1.5 bg-[#EAD9C8]/50 text-[#2C1E1E] text-xs rounded-full border border-[#EAD9C8]">
              "¿Qué talla me recomiendas?"
            </span>
            <span className="px-3 py-1.5 bg-[#EAD9C8]/50 text-[#2C1E1E] text-xs rounded-full border border-[#EAD9C8]">
              "¿Cómo funciona el kit?"
            </span>
            <span className="px-3 py-1.5 bg-[#EAD9C8]/50 text-[#2C1E1E] text-xs rounded-full border border-[#EAD9C8]">
              "¿Tienen envío gratis?"
            </span>
            <span className="px-3 py-1.5 bg-[#EAD9C8]/50 text-[#2C1E1E] text-xs rounded-full border border-[#EAD9C8]">
              "Quiero ver el short"
            </span>
          </div>

          {/* Instrucción */}
          <p className="text-[#6D4A40]/60 text-xs text-center">
            Presiona el botón y habla con Sofía
          </p>
        </div>
      )}

      {transcript.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] px-3 py-2 text-[13px] leading-relaxed ${
              entry.speaker === 'user'
                ? 'bg-[#EAD9C8] text-[#2C1E1E] rounded-[16px] rounded-br-[4px]'
                : 'bg-white text-[#2C1E1E] border border-[#EDE9E6] rounded-[16px] rounded-bl-[4px]'
            }`}
            style={{ boxShadow: '0 2px 8px rgba(44, 30, 30, 0.06)' }}
          >
            {entry.text}
          </div>
        </motion.div>
      ))}

      {/* Live input */}
      {currentInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="flex justify-end"
        >
          <div className="max-w-[75%] px-3 py-2 text-[13px] bg-[#EAD9C8]/60 text-[#2C1E1E] rounded-[16px] rounded-br-[4px] italic">
            {cleanTriggers(currentInput)}
          </div>
        </motion.div>
      )}

      {/* Live output */}
      {currentOutput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="flex justify-start"
        >
          <div className="max-w-[75%] px-3 py-2 text-[13px] bg-white/60 text-[#2C1E1E] border border-[#EDE9E6]/60 rounded-[16px] rounded-bl-[4px] italic">
            {cleanTriggers(currentOutput)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE: Orbe de Sofía
// ============================================
const SofiaOrb = ({ sessionState, onClick, disabled }) => {
  const getIcon = () => {
    switch (sessionState) {
      case SessionState.CONNECTING:
        return <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin" />;
      case SessionState.ACTIVE:
        return <Square className="w-7 h-7 md:w-8 md:h-8 text-white" />;
      default:
        return <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />;
    }
  };

  const getStateText = () => {
    switch (sessionState) {
      case SessionState.CONNECTING:
        return 'Conectando...';
      case SessionState.ACTIVE:
        return 'Toca para detener';
      default:
        return 'Toca para hablar';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Container del orbe */}
      <div className="relative">
        {/* Ondas de conexión - CSS animation (sin AnimatePresence) */}
        {sessionState === SessionState.CONNECTING && (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  border: '2px solid rgba(201, 111, 123, 0.4)',
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </>
        )}

        {/* Barras de audio */}
        {sessionState === SessionState.ACTIVE && (
          <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white/50 rounded-full"
                animate={{
                  height: [16, 32, 16],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        )}

        {/* Orbe principal */}
        <motion.button
          onClick={onClick}
          disabled={disabled}
          className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full flex items-center justify-center cursor-pointer transition-shadow duration-300"
          style={{
            background: sessionState === SessionState.ACTIVE
              ? 'linear-gradient(135deg, #2C1E1E 0%, #6D4A40 100%)'
              : 'linear-gradient(135deg, #C96F7B 0%, #EAD9C8 50%, #F88379 100%)',
            boxShadow: sessionState === SessionState.ACTIVE
              ? '0 0 50px rgba(44, 30, 30, 0.4), inset 0 0 30px rgba(255,255,255,0.1)'
              : '0 0 50px rgba(201, 111, 123, 0.4), inset 0 0 30px rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.3)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={sessionState === SessionState.IDLE ? {
            scale: [1, 1.02, 1],
          } : {}}
          transition={sessionState === SessionState.IDLE ? {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          } : {
            duration: 0.15
          }}
        >
          {/* Icono */}
          <div className="relative z-10">
            {getIcon()}
          </div>
        </motion.button>
      </div>

      {/* Texto del estado */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#2C1E1E]">{getStateText()}</p>
        {sessionState === SessionState.IDLE && (
          <p className="text-xs text-[#6D4A40] mt-1">Habla con Sofía sobre nuestros productos</p>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE: Product Showcase Overlay
// ============================================
const AUTO_DISMISS_DURATION = 8000; // 8 segundos

const ProductShowcaseOverlay = ({ product, onBuy, onClose }) => {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep onClose ref updated without triggering effect
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Auto-dismiss timer - only depends on product.id
  useEffect(() => {
    if (!product) return;

    // Clear any existing timers
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);

    // Reset progress when product changes
    setProgress(100);

    // Start countdown
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_DURATION) * 100);
      setProgress(remaining);
    }, 50);

    // Auto-close after 8 seconds
    timerRef.current = setTimeout(() => {
      onCloseRef.current?.();
    }, AUTO_DISMISS_DURATION);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, [product?.id]);

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(44, 30, 30, 0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        key={product.id}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white rounded-[28px] p-6 w-full max-w-[320px]"
        style={{ boxShadow: '0 25px 80px rgba(44, 30, 30, 0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar for auto-dismiss */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#EDE9E6] rounded-t-[28px] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C96F7B] to-[#F88379]"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FBF7F4] hover:bg-[#EAD9C8] flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4 text-[#6D4A40]" />
        </button>

        {/* Imagen del producto */}
        <div className="relative mb-4 rounded-[20px] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          {product.discount && (
            <span
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{
                background: '#C96F7B',
                boxShadow: '0 4px 12px rgba(201, 111, 123, 0.3)'
              }}
            >
              {product.discount}
            </span>
          )}
        </div>

        {/* Info del producto */}
        <div className="text-center mb-4">
          <h3 className="font-serif text-xl font-bold text-[#2C1E1E] mb-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#6D4A40] mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-[#F88379]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Botón CTA */}
        <motion.button
          onClick={() => onBuy(product)}
          className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #C96F7B 0%, #F88379 100%)',
            boxShadow: '0 8px 24px rgba(201, 111, 123, 0.35)'
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(201, 111, 123, 0.45)' }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart className="w-5 h-5" />
          Comprar Ahora
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL: VoiceAssistant
// ============================================
export const VoiceAssistant = ({ apiKey, onBuyProduct }) => {
  const [sessionState, setSessionState] = useState(SessionState.IDLE);
  const [transcript, setTranscript] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  const sessionPromiseRef = useRef(null);
  const liveSessionRef = useRef(null);
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const playbackSources = useRef(new Set());
  const nextStartTime = useRef(0);
  const isMountedRef = useRef(true); // Para prevenir updates después de unmount

  const cleanupAudioResources = useCallback(() => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current.onaudioprocess = null;
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    playbackSources.current.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    playbackSources.current.clear();
    if (inputAudioContextRef.current?.state !== 'closed') {
      inputAudioContextRef.current?.close().catch(() => {});
    }
    if (outputAudioContextRef.current?.state !== 'closed') {
      outputAudioContextRef.current?.close().catch(() => {});
    }
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
  }, []);

  const handleStopSession = useCallback(async () => {
    setSessionState(SessionState.IDLE);

    // Limpiar referencias ANTES de cerrar para evitar envíos mientras cierra
    const sessionToClose = liveSessionRef.current;
    liveSessionRef.current = null;
    sessionPromiseRef.current = null;

    // Limpiar audio primero para detener el onaudioprocess
    cleanupAudioResources();

    // Ahora cerrar la sesión de forma segura
    if (sessionToClose) {
      try {
        sessionToClose.close();
      } catch (e) {
        console.debug('Session close skipped');
      }
    }

    if (currentInput || currentOutput) {
      setTranscript(prev => {
        const newTranscript = [...prev];
        if (currentInput) newTranscript.push({ speaker: 'user', text: cleanTriggers(currentInput) });
        if (currentOutput) newTranscript.push({ speaker: 'model', text: cleanTriggers(currentOutput) });
        return newTranscript;
      });
      setCurrentInput('');
      setCurrentOutput('');
    }
  }, [cleanupAudioResources, currentInput, currentOutput]);

  const handleStartSession = useCallback(async () => {
    if (sessionState !== SessionState.IDLE) return;

    setError(null);
    setTranscript([]);
    setSessionState(SessionState.CONNECTING);

    try {
      // Verificar que la API key exista
      if (!apiKey) {
        throw new Error('API Key de Gemini no configurada. Verifica VITE_GEMINI_API_KEY en .env.local');
      }

      console.log('🎤 Iniciando conexión con Gemini Live API...');
      const ai = new GoogleGenAI({ apiKey });

      // Track which triggers have been detected this turn to avoid duplicates
      const detectedTriggersThisTurn = new Set();

      const onMessage = async (message) => {
        // Prevenir updates si el componente ya no está montado
        if (!isMountedRef.current) return;

        if (message.serverContent?.outputTranscription) {
          const text = message.serverContent.outputTranscription.text;

          // Update accumulated output and check for triggers in FULL accumulated text
          setCurrentOutput(prev => {
            const accumulated = prev + text;

            // Detectar TODOS los triggers en el texto acumulado
            const allTriggers = detectAllProductTriggers(accumulated);
            const newTriggers = allTriggers.filter(key => !detectedTriggersThisTurn.has(key));

            // Mostrar cada producto nuevo con delay secuencial
            newTriggers.forEach((productKey, index) => {
              detectedTriggersThisTurn.add(productKey);
              // Delay de 3 segundos entre cada producto para dar tiempo al auto-dismiss
              setTimeout(() => {
                setCurrentProduct(PRODUCTS[productKey]);
              }, index * 3000);
            });

            // Check for checkout redirect in accumulated text
            if (accumulated.includes('[REDIRECT_CHECKOUT]') && !detectedTriggersThisTurn.has('CHECKOUT')) {
              detectedTriggersThisTurn.add('CHECKOUT');
              const lastProduct = allTriggers[allTriggers.length - 1];
              setTimeout(() => onBuyProduct?.(PRODUCTS[lastProduct] || PRODUCTS.KIT), 0);
            }

            return accumulated;
          });
        } else if (message.serverContent?.inputTranscription) {
          const text = message.serverContent.inputTranscription.text;
          setCurrentInput(prev => prev + text);
        }

        if (message.serverContent?.turnComplete) {
          // Resetear triggers detectados para el próximo turno
          // Esto permite que el mismo producto pueda mostrarse de nuevo en turnos futuros
          detectedTriggersThisTurn.clear();

          setTranscript(prev => {
            const fullInput = currentInput + (message.serverContent?.inputTranscription?.text ?? '');
            const fullOutput = currentOutput + (message.serverContent?.outputTranscription?.text ?? '');
            const newEntries = [];
            if (fullInput.trim()) newEntries.push({ speaker: 'user', text: cleanTriggers(fullInput.trim()) });
            if (fullOutput.trim()) newEntries.push({ speaker: 'model', text: cleanTriggers(fullOutput.trim()) });
            return [...prev, ...newEntries];
          });
          setCurrentInput('');
          setCurrentOutput('');
        }

        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64EncodedAudioString && outputAudioContextRef.current) {
          const audioContext = outputAudioContextRef.current;
          nextStartTime.current = Math.max(nextStartTime.current, audioContext.currentTime);
          const audioBuffer = await decodeAudioData(
            decode(base64EncodedAudioString),
            audioContext,
            24000,
            1
          );
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.addEventListener('ended', () => playbackSources.current.delete(source));
          source.start(nextStartTime.current);
          nextStartTime.current += audioBuffer.duration;
          playbackSources.current.add(source);
        }

        if (message.serverContent?.interrupted) {
          playbackSources.current.forEach(source => {
            try { source.stop(); } catch (e) { /* ignore */ }
          });
          playbackSources.current.clear();
          nextStartTime.current = 0;
        }
      };

      const onOpen = async (session) => {
        console.log('✅ WebSocket conectado exitosamente');
        liveSessionRef.current = session;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
        outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const inputAudioContext = inputAudioContextRef.current;

        mediaStreamSourceRef.current = inputAudioContext.createMediaStreamSource(mediaStreamRef.current);
        scriptProcessorRef.current = inputAudioContext.createScriptProcessor(4096, 1, 1);

        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
          // Verificar que la sesión esté activa antes de enviar audio
          if (!isMountedRef.current || !liveSessionRef.current || !sessionPromiseRef.current) {
            return;
          }

          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);

          sessionPromiseRef.current.then((session) => {
            // Doble verificación antes de enviar
            if (!isMountedRef.current || !liveSessionRef.current) return;
            try {
              session.sendRealtimeInput({ media: pcmBlob });
            } catch (err) {
              // Ignorar errores de WebSocket cerrado silenciosamente
              console.debug('Audio send skipped - session closing');
            }
          }).catch(err => {
            if (!isMountedRef.current) return;
            // Solo mostrar error si no es por cierre de sesión
            if (liveSessionRef.current) {
              setError("Hubo un problema al enviar el audio.");
              handleStopSession();
            }
          });
        };

        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(inputAudioContext.destination);
        setSessionState(SessionState.ACTIVE);
      };

      const onError = (e) => {
        console.error('❌ Error en WebSocket:', e);
        if (!isMountedRef.current) return;
        setError("Ocurrió un error en la conexión. Por favor, intenta de nuevo.");
        setSessionState(SessionState.ERROR);
        handleStopSession();
      };

      const onClose = () => {
        console.log('🔌 WebSocket cerrado');
        cleanupAudioResources();
        if (!isMountedRef.current) return;
        if (sessionState !== SessionState.IDLE) {
          setSessionState(SessionState.IDLE);
        }
      };

      console.log('🔗 Conectando a Gemini Live API...');
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('📡 Callback onopen ejecutado');
            sessionPromiseRef.current?.then(onOpen).catch(onError);
          },
          onmessage: onMessage,
          onerror: onError,
          onclose: onClose,
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      console.log('⏳ Esperando conexión...');
      await sessionPromiseRef.current;
      console.log('✅ Sesión establecida');

    } catch (err) {
      if (!isMountedRef.current) return;
      const errorMessage = err instanceof Error ? err.message : "Un error desconocido ocurrió.";
      setError(`Error al iniciar: ${errorMessage}`);
      setSessionState(SessionState.ERROR);
      cleanupAudioResources();
    }
  }, [sessionState, handleStopSession, cleanupAudioResources, currentInput, currentOutput, apiKey, onBuyProduct, currentProduct]);

  const handleToggleSession = () => {
    if (sessionState === SessionState.IDLE || sessionState === SessionState.ERROR) {
      handleStartSession();
    } else {
      handleStopSession();
    }
  };

  const handleBuyFromShowcase = (product) => {
    onBuyProduct?.(product);
  };

  // Cleanup al desmontar - previene el bug de flash en navegación
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      // Limpiar sesión de Gemini
      if (liveSessionRef.current) {
        try {
          liveSessionRef.current.close();
        } catch (e) { /* ignore */ }
        liveSessionRef.current = null;
      }
      sessionPromiseRef.current = null;

      // Limpiar recursos de audio
      if (scriptProcessorRef.current) {
        try {
          scriptProcessorRef.current.disconnect();
          scriptProcessorRef.current.onaudioprocess = null;
        } catch (e) { /* ignore */ }
        scriptProcessorRef.current = null;
      }
      if (mediaStreamSourceRef.current) {
        try {
          mediaStreamSourceRef.current.disconnect();
        } catch (e) { /* ignore */ }
        mediaStreamSourceRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) { /* ignore */ }
        });
        mediaStreamRef.current = null;
      }
      playbackSources.current.forEach(source => {
        try { source.stop(); } catch (e) { /* ignore */ }
      });
      playbackSources.current.clear();

      // Cerrar AudioContexts
      if (inputAudioContextRef.current?.state !== 'closed') {
        inputAudioContextRef.current?.close().catch(() => {});
      }
      if (outputAudioContextRef.current?.state !== 'closed') {
        outputAudioContextRef.current?.close().catch(() => {});
      }
      inputAudioContextRef.current = null;
      outputAudioContextRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Main Container */}
      <main
        className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FBF7F4 0%, #EDE9E6 100%)' }}
      >
        {/* Decorative Background Circles */}
        <div
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201, 111, 123, 0.3) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(248, 131, 121, 0.3) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute top-1/4 -left-16 w-32 h-32 rounded-full opacity-15 pointer-events-none hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(234, 217, 200, 0.5) 0%, transparent 70%)'
          }}
        />

        <div className="w-full max-w-md lg:max-w-5xl flex flex-col lg:flex-row gap-4 items-stretch relative z-10">

          {/* Panel principal del asistente */}
          <div
            className="flex-1 bg-white rounded-[28px] flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(44, 30, 30, 0.12)',
              minHeight: '80vh',
              maxHeight: '90vh'
            }}
          >
            {/* Header */}
            <SofiaHeader sessionState={sessionState} />

            {/* Transcript */}
            <MinimalTranscript
              transcript={transcript}
              currentInput={currentInput}
              currentOutput={currentOutput}
            />

            {/* Error */}
            {error && (
              <div className="mx-4 mb-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Orbe */}
            <div className="flex-shrink-0 border-t border-[#EDE9E6]">
              <SofiaOrb
                sessionState={sessionState}
                onClick={handleToggleSession}
                disabled={sessionState === SessionState.CONNECTING}
              />
            </div>
          </div>

          {/* Sidebar para producto (solo desktop) - Sin AnimatePresence */}
          <div className="hidden lg:flex lg:w-[320px] items-center justify-center">
            {currentProduct ? (
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-[24px] p-5 w-full"
                style={{ boxShadow: '0 16px 48px rgba(44, 30, 30, 0.15)' }}
              >
                {/* Cerrar */}
                <button
                  onClick={() => setCurrentProduct(null)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FBF7F4] hover:bg-[#EAD9C8] flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[#6D4A40]" />
                </button>

                {/* Imagen */}
                <div className="relative mb-3 rounded-[16px] overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full aspect-square object-cover"
                  />
                  {currentProduct.discount && (
                    <span
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: '#C96F7B' }}
                    >
                      {currentProduct.discount}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="text-center mb-3">
                  <h3 className="font-serif text-lg font-bold text-[#2C1E1E] mb-0.5">
                    {currentProduct.name}
                  </h3>
                  <p className="text-xs text-[#6D4A40] mb-2">
                    {currentProduct.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold text-[#F88379]">
                      {currentProduct.price}
                    </span>
                    {currentProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {currentProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => handleBuyFromShowcase(currentProduct)}
                  className="w-full py-3 px-5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #C96F7B 0%, #F88379 100%)',
                    boxShadow: '0 6px 20px rgba(201, 111, 123, 0.3)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Ahora
                </motion.button>
              </motion.div>
            ) : sessionState === SessionState.ACTIVE ? (
              <div className="text-center p-6 bg-white/60 rounded-[20px] backdrop-blur-sm transition-opacity duration-300">
                <p className="text-[#6D4A40] text-sm">
                  Pregúntale a Sofía<br/>sobre nuestros productos...
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Overlay de producto para mobile - Sin AnimatePresence */}
      {currentProduct && (
        <div className="lg:hidden">
          <ProductShowcaseOverlay
            product={currentProduct}
            onBuy={handleBuyFromShowcase}
            onClose={() => setCurrentProduct(null)}
          />
        </div>
      )}
    </>
  );
};
