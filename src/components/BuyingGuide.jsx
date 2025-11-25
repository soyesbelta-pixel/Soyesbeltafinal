import { motion } from 'framer-motion';
import { Target, Ruler, Calendar, Heart, Shield, Star, ArrowRight, CheckCircle, AlertCircle, TrendingUp, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const BuyingGuide = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isStoryInView, setIsStoryInView] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeMistakeIndex, setActiveMistakeIndex] = useState(0);
  const storyVideoRef = useRef(null);
  const autoAdvanceRef = useRef(null);
  const stepsScrollRef = useRef(null);
  const mistakesScrollRef = useRef(null);

  const storySegments = useMemo(() => [
    {
      id: 'invisible',
      label: 'Modo invisible',
      description: 'Diseño discreto que no se marca bajo la ropa.',
      cueStart: 0,
      cueEnd: 2,
      durationMs: 2000
    },
    {
      id: 'abdomen',
      label: 'Control de abdomen',
      description: 'Triple refuerzo para control de abdomen medio y bajo.',
      cueStart: 2,
      cueEnd: 6,
      durationMs: 4000
    },
    {
      id: 'pushup',
      label: 'Sistema push up',
      description: 'Levanta el glúteo de manera natural y cómoda.',
      cueStart: 8,
      cueEnd: 14,
      durationMs: 6000
    },
    {
      id: 'encaje',
      label: 'Encaje ensiliconado inferior',
      description: 'Blonda siliconada en cintura y piernas que no se enrolla.',
      cueStart: 19,
      cueEnd: 24,
      durationMs: 5000
    },
    {
      id: 'esbelta',
      label: 'Esbelta',
      description: 'El resultado final: silueta perfecta y natural.',
      cueStart: 24,
      cueEnd: 29,
      durationMs: 5000
    }
  ], []);

  const handleVideoError = (e) => {
    console.error('❌ Video error en BuyingGuide:', e);
    console.error('Video src:', '/videos/short-invisible-story.mp4');
    console.error('Error details:', e.target.error);
    setVideoError(true);
  };

  const handleStepsScroll = () => {
    if (stepsScrollRef.current) {
      const container = stepsScrollRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveStepIndex(index);
    }
  };

  const handleMistakesScroll = () => {
    if (mistakesScrollRef.current) {
      const container = mistakesScrollRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveMistakeIndex(index);
    }
  };

  useEffect(() => {
    const video = storyVideoRef.current;
    if (!video) return;

    const segment = storySegments[activeStory];
    const syncSegment = () => {
      if (!isStoryInView) {
        video.pause();
        return;
      }

      const setTime = () => {
        video.currentTime = segment.cueStart;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      };

      if (video.readyState >= 1) {
        setTime();
      } else {
        const handleMetadata = () => {
          setTime();
        };
        video.addEventListener('loadedmetadata', handleMetadata, { once: true });
      }
    };

    syncSegment();

    const handleTimeUpdate = () => {
      if (video.currentTime >= segment.cueEnd) {
        video.currentTime = segment.cueStart;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [activeStory, isStoryInView, storySegments]);

  useEffect(() => {
    if (!isStoryInView) {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      return;
    }

    const currentSegment = storySegments[activeStory];
    autoAdvanceRef.current = setTimeout(() => {
      setActiveStory((prev) => (prev + 1) % storySegments.length);
    }, currentSegment.durationMs);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [activeStory, isStoryInView, storySegments]);

  const activeSegment = storySegments[activeStory];

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      if (storyVideoRef.current) {
        storyVideoRef.current.pause();
      }
    };
  }, []);

  const steps = [
    {
      number: "1",
      title: "Define tu Objetivo",
      description: "¿Para qué necesitas la faja?",
      icon: Target,
      details: [
        "Post-operatorio o recuperación",
        "Moldear figura diariamente",
        "Apoyo durante ejercicio",
        "Eventos especiales"
      ]
    },
    {
      number: "2",
      title: "Conoce tu Talla",
      description: "Mide correctamente tu cuerpo",
      icon: Ruler,
      details: [
        "Mide cintura y cadera",
        "Usa nuestra guía de tallas",
        "Considera el nivel de compresión",
        "Si dudas, consulta con asesor"
      ]
    },
    {
      number: "3",
      title: "Elige el Tipo",
      description: "Selecciona el modelo adecuado",
      icon: Heart,
      details: [
        "Body completo vs faja corta",
        "Con o sin tirantes",
        "Cierre frontal o lateral",
        "Apertura perineal si necesitas"
      ]
    },
    {
      number: "4",
      title: "Considera el Material",
      description: "Calidad y comodidad",
      icon: Shield,
      details: [
        "PowerNet para alta compresión",
        "Lycra para uso diario",
        "Neopreno para ejercicio",
        "Algodón interior para piel sensible"
      ]
    }
  ];

  const mistakes = [
    {
      mistake: "Elegir talla incorrecta",
      consequence: "Incomodidad o falta de resultados",
      solution: "Usa nuestra guía y mide correctamente"
    },
    {
      mistake: "Usar la misma faja para todo",
      consequence: "Desgaste prematuro y menos efectividad",
      solution: "Ten fajas específicas para cada necesidad"
    },
    {
      mistake: "No considerar el material",
      consequence: "Irritación o alergias en la piel",
      solution: "Revisa composición y elige hipoalergénico"
    },
    {
      mistake: "Ignorar las instrucciones de cuidado",
      consequence: "Pérdida de elasticidad y forma",
      solution: "Sigue nuestras guías de mantenimiento"
    }
  ];

  return (
    <section id="guia-compra" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
            Guía de Compra Personalizada
          </h2>
          <p className="text-esbelta-chocolate-light max-w-2xl mx-auto">
            Te ayudamos a elegir la faja perfecta según tus necesidades y objetivos
          </p>
        </div>

        {/* Step by Step Guide - Mobile Carousel / Desktop Grid */}
        <div className="relative mb-12">
          {/* Mobile Carousel */}
          <div
            ref={stepsScrollRef}
            onScroll={handleStepsScroll}
            className="lg:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 px-4 -mx-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <step.icon className="w-6 h-6 text-esbelta-sand" />
                  </div>

                  <h3 className="font-bold text-esbelta-chocolate mb-2">{step.title}</h3>
                  <p className="text-sm text-esbelta-chocolate-light mb-4">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-esbelta-sand flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-esbelta-chocolate-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dots Indicator */}
          <div className="lg:hidden flex justify-center gap-2 mt-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (stepsScrollRef.current) {
                    const cardWidth = stepsScrollRef.current.offsetWidth * 0.85;
                    stepsScrollRef.current.scrollTo({
                      left: cardWidth * index,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  index === activeStepIndex
                    ? 'w-8 bg-esbelta-terracotta'
                    : 'w-2 bg-esbelta-sand'
                }`}
              />
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-esbelta-sand mx-auto" />
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <step.icon className="w-6 h-6 text-esbelta-sand" />
                  </div>

                  <h3 className="font-bold text-esbelta-chocolate mb-2">{step.title}</h3>
                  <p className="text-sm text-esbelta-chocolate-light mb-4">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-esbelta-sand flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-esbelta-chocolate-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video storytelling */}
        <motion.div
          onViewportEnter={() => setIsStoryInView(true)}
          onViewportLeave={() => setIsStoryInView(false)}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(181,140,120,0.12),transparent_60%)] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-esbelta-terracotta">
                <span className="w-2 h-2 rounded-full bg-esbelta-terracotta" /> En movimiento
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-esbelta-chocolate">
                Así luce el Short Levanta Gluteo Invisible paso a paso
              </h3>
              <p className="text-esbelta-chocolate-light max-w-xl">
                Desliza o toca cada momento para ver cómo el short se ajusta, controla el abdomen y levanta de forma natural. El video se reinicia en cada etapa para que no te pierdas ningún detalle.
              </p>
              <div className="space-y-3">
                {storySegments.map((segment, index) => {
                  const isEsbelta = segment.id === 'esbelta';
                  return (
                    <motion.button
                      key={segment.id}
                      type="button"
                      onClick={() => setActiveStory(index)}
                      className={`w-full text-left rounded-2xl border transition-all px-4 py-3 ${
                        activeStory === index
                          ? 'border-esbelta-terracotta bg-white shadow-lg'
                          : 'border-esbelta-sand-light bg-white/70 hover:bg-white shadow-sm'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                          activeStory === index
                            ? 'bg-esbelta-terracotta text-white'
                            : 'bg-esbelta-sand text-esbelta-chocolate'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold text-esbelta-chocolate ${isEsbelta ? 'font-whistling text-xl leading-none' : ''}`}>
                            {segment.label}
                          </p>
                          <p className="text-xs text-esbelta-chocolate-light mt-1">
                            {segment.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10">
              <div className="aspect-[9/16] w-full max-w-sm mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-esbelta-sand-light bg-black/90">
                {!videoError ? (
                  <>
                    <video
                      ref={storyVideoRef}
                      src="/videos/short-invisible-story.mp4"
                      muted
                      playsInline
                      preload="metadata"
                      onError={handleVideoError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-2 bg-black/70 text-white text-xs px-4 py-2 rounded-full">
                        <Play className="w-4 h-4" />
                        <span className={activeSegment.id === 'esbelta' ? 'font-whistling text-lg leading-none' : ''}>
                          {activeSegment.label}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6">
                    <img
                      src="/short-magic-negro-1.png"
                      alt="Short Levanta Gluteo Invisible"
                      className="w-3/4 h-auto object-contain mb-4"
                    />
                    <p className="text-sm text-esbelta-chocolate text-center mb-2">
                      <strong>{activeSegment.label}</strong>
                    </p>
                    <p className="text-xs text-esbelta-chocolate-light text-center">
                      {activeSegment.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center text-xs text-esbelta-chocolate-light">
                {!videoError
                  ? '¿Quieres verlo completo? Abre el producto "Short Levanta Gluteo Invisible" y toca "Ver en movimiento".'
                  : 'El video de demostración no está disponible temporalmente. La imagen muestra el producto real.'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Common Mistakes - Mobile Carousel / Desktop Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
            Errores Comunes al Comprar
          </h3>

          <div className="relative">
            {/* Mobile Carousel */}
            <div
              ref={mistakesScrollRef}
              onScroll={handleMistakesScroll}
              className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {mistakes.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[85vw] snap-center"
                >
                  <div className="border border-esbelta-sand-light rounded-xl p-4 h-full">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-esbelta-terracotta flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-esbelta-chocolate mb-1">
                          {item.mistake}
                        </h4>
                        <p className="text-xs text-esbelta-chocolate-light mb-2">
                          {item.consequence}
                        </p>
                        <div className="bg-esbelta-sand/10 rounded-lg p-2">
                          <p className="text-xs text-esbelta-sand-dark">
                            ✓ {item.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Dots Indicator */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
              {mistakes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (mistakesScrollRef.current) {
                      const cardWidth = mistakesScrollRef.current.offsetWidth * 0.85;
                      mistakesScrollRef.current.scrollTo({
                        left: cardWidth * index,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === activeMistakeIndex
                      ? 'w-8 bg-esbelta-terracotta'
                      : 'w-2 bg-esbelta-sand'
                  }`}
                />
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {mistakes.map((item, index) => (
                <div
                  key={index}
                  className="border border-esbelta-sand-light rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-esbelta-terracotta flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-esbelta-chocolate mb-1">
                        {item.mistake}
                      </h4>
                      <p className="text-xs text-esbelta-chocolate-light mb-2">
                        {item.consequence}
                      </p>
                      <div className="bg-esbelta-sand/10 rounded-lg p-2">
                        <p className="text-xs text-esbelta-sand-dark">
                          ✓ {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BuyingGuide;
