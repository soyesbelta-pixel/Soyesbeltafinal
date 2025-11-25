import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const VideoStorySection = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isStoryInView, setIsStoryInView] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const storyVideoRef = useRef(null);
  const autoAdvanceRef = useRef(null);

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
    console.error('❌ Video error en VideoStorySection:', e);
    console.error('Video src:', '/videos/short-invisible-story.mp4');
    console.error('Error details:', e.target.error);
    setVideoError(true);
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Video storytelling */}
        <motion.div
          onViewportEnter={() => setIsStoryInView(true)}
          onViewportLeave={() => setIsStoryInView(false)}
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoStorySection;
