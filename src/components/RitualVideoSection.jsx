import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const RitualVideoSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  const ritualSteps = useMemo(() => [
    {
      id: 'masajea',
      num: 1,
      title: 'Tonifica el Glúteo',
      time: '60–90s',
      description: 'Aceite de fenogreco, de abajo hacia arriba',
      videoSrc: '/landing-short-invisible/videos/ritual-masajea.mp4',
      durationMs: 7000
    },
    {
      id: 'exfolia',
      num: 2,
      title: 'Reduce Celulitis',
      time: '30–60s',
      description: 'Ducha + exfoliante, movimientos circulares',
      videoSrc: '/landing-short-invisible/videos/ritual-exfolia.mp4',
      durationMs: 8000
    },
    {
      id: 'coloca',
      num: 3,
      title: 'Moldea el Glúteo',
      time: '30s',
      description: 'Short invisible, look listo',
      videoSrc: '/landing-short-invisible/videos/ritual-coloca.mp4',
      durationMs: 19000
    }
  ], []);

  const handleVideoError = (e) => {
    console.error('❌ Video error en RitualVideoSection:', e);
    console.error('Video src:', ritualSteps[activeStep]?.videoSrc);
    console.error('Error details:', e.target.error);
    setVideoError(true);
  };

  // Sincronizar video con el paso activo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const step = ritualSteps[activeStep];

    // Cambiar source del video
    video.src = step.videoSrc;
    video.load();

    const playVideo = () => {
      if (!isInView) {
        video.pause();
        return;
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    // Reproducir cuando esté listo
    if (video.readyState >= 1) {
      playVideo();
    } else {
      video.addEventListener('loadedmetadata', playVideo, { once: true });
    }

    return () => {
      video.pause();
    };
  }, [activeStep, isInView, ritualSteps]);

  // Auto-avance entre pasos
  useEffect(() => {
    if (!isInView) {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      return;
    }

    const currentStep = ritualSteps[activeStep];
    autoAdvanceRef.current = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % ritualSteps.length);
    }, currentStep.durationMs);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [activeStep, isInView, ritualSteps]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const activeRitualStep = ritualSteps[activeStep];

  return (
    <section id="ritual" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading mb-4 text-esbelta-chocolate">
            El Ritual 3 Pasos
          </h2>
        </div>

        {/* Video interactivo */}
        <motion.div
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden">
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(181,140,120,0.12),transparent_60%)] pointer-events-none" />

            {/* Columna izquierda: Botones */}
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-esbelta-terracotta">
                <span className="w-2 h-2 rounded-full bg-esbelta-terracotta" /> Paso a paso
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-esbelta-chocolate">
                Tu rutina diaria para resultados visibles
              </h3>
              <p className="text-esbelta-chocolate-light max-w-xl">
                Toca cada paso para ver cómo se realiza. El video se reproduce automáticamente en cada etapa.
              </p>

              <div className="space-y-3">
                {ritualSteps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left rounded-2xl border transition-all px-4 py-3 ${
                      activeStep === index
                        ? 'border-esbelta-terracotta bg-white shadow-lg'
                        : 'border-esbelta-sand-light bg-white/70 hover:bg-white shadow-sm'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                        activeStep === index
                          ? 'bg-esbelta-terracotta text-white'
                          : 'bg-esbelta-sand text-esbelta-chocolate'
                      }`}>
                        {step.num}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-esbelta-chocolate mb-1">
                          {step.title}
                        </p>
                        <p className="text-xs text-esbelta-chocolate-light">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Columna derecha: Video */}
            <div className="relative z-10">
              <div className="aspect-[9/16] w-full max-w-sm mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-esbelta-sand-light bg-black/90">
                {!videoError ? (
                  <>
                    <video
                      ref={videoRef}
                      muted
                      loop
                      playsInline
                      preload="none"
                      onError={handleVideoError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-2 bg-black/70 text-white text-xs px-4 py-2 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-esbelta-coral" />
                        <span>
                          Paso {activeRitualStep.num}: {activeRitualStep.title}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-esbelta-sand flex items-center justify-center text-2xl font-bold text-esbelta-chocolate mx-auto mb-4">
                        {activeRitualStep.num}
                      </div>
                      <p className="text-sm text-esbelta-chocolate mb-2 font-semibold">
                        {activeRitualStep.title}
                      </p>
                      <p className="text-xs text-esbelta-chocolate-light">
                        {activeRitualStep.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-sm font-body text-center mt-8 italic text-esbelta-chocolate/50">
          El fenogreco se usa tradicionalmente en masajes; no es medicamento. Resultados y tiempos pueden variar.
        </p>
      </div>
    </section>
  );
};

export default RitualVideoSection;
