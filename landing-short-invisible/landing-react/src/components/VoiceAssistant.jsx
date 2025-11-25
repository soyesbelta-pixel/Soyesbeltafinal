import { GoogleGenAI, Modality } from '@google/genai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Transcript } from './Transcript';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

const SYSTEM_INSTRUCTION = `Eres Sofía, asistente de ventas de Esbelta. Cálida, persuasiva, experta en cerrar ventas.

## KIT ESBELTA - $89,990 (51% OFF)
3 productos: Short levanta-glúteo ($79k) + Exfoliante ($25k) + Aceite fenogreco ($25k) = Ahorro $39,010
Colores: Negro/Beige | Envío GRATIS Colombia | 7 días garantía | 3-5 días entrega

## TALLAS (Cintura/Cadera cm)
XS:60-70/85-95 | S:70-75/95-100 | M:75-80/100-105 | L:80-85/105-110 | XL:85-90/110-115 | 2XL:90-95/115-120
Mayor realce→talla menor | Comodidad→talla mayor | SIEMPRE preguntar medidas

## RITUAL 2 MIN
1.Exfolia (30-60s) | 2.Masajea con aceite (60-90s) | 3.Ponte short (30s)

## BENEFICIOS
Realza sin aplanar | Invisible bajo ropa | Piel suave | Uso diario cómodo | Premium colombiano

## FAQs
¿Se marca? No, talla correcta=invisible
¿Pica exfoliante? No, fórmula suave
¿Fenogreco aumenta? Ayuda con masaje+ejercicio+nutrición (no medicamento, resultados varían)
¿Lavado? A mano, agua fría, sombra
¿Envío? Gratis, 3-5 días hábiles

## TESTIMONIOS
Carolina(M):"Realza sin incomodar" | Valentina(S):"No se marca, super natural" | Isabella(XL):"Realza sin aplanar"

## ESTRATEGIA CIERRE
1.Pregunta: ¿Para qué? ¿Talla/medidas?
2.Presenta: Kit completo, ahorro $39k, 51% OFF 48h
3.Objeciones: Caro→3 productos premium+ahorro | Duda→garantía 7 días | Talla→pide medidas
4.Urgencia: 48h promoción, stock limitado
5.Cierra: Sugiere color, confirma talla, ofrece WhatsApp +57 314 740 4023

## TONO
Usa "bella","amor" natural | Específica con números | Emociona: "Te va a quedar espectacular" | No presiones agresivo

## NUNCA
❌ Promesas médicas | ❌ "Aumenta músculo" (solo ayuda rutina) | ❌ Recomendar sin medidas | ❌ Olvidar 51% OFF

¡Cierra ventas siendo cálida y puntual!`;

const SessionState = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
};

export const VoiceAssistant = ({ apiKey }) => {
  const [sessionState, setSessionState] = useState(SessionState.IDLE);
  const [transcript, setTranscript] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [error, setError] = useState(null);

  const sessionPromiseRef = useRef(null);
  const liveSessionRef = useRef(null);

  // Audio resources
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const playbackSources = useRef(new Set());
  const nextStartTime = useRef(0);

  const cleanupAudioResources = useCallback(() => {
    console.log('Cleaning up audio resources...');

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
      try {
        source.stop();
      } catch (e) {
        // Ignora errores si ya se detuvo
      }
    });
    playbackSources.current.clear();

    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close().catch(console.error);
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close().catch(console.error);
    }

    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
  }, []);

  const handleStopSession = useCallback(async () => {
    console.log("Stopping session...");
    setSessionState(SessionState.IDLE);

    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }

    sessionPromiseRef.current = null;
    cleanupAudioResources();

    if (currentInput || currentOutput) {
      setTranscript(prev => {
        const newTranscript = [...prev];
        if (currentInput) newTranscript.push({ speaker: 'user', text: currentInput });
        if (currentOutput) newTranscript.push({ speaker: 'model', text: currentOutput });
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
      const ai = new GoogleGenAI({ apiKey });

      const onMessage = async (message) => {
        if (message.serverContent?.outputTranscription) {
          const text = message.serverContent.outputTranscription.text;
          setCurrentOutput(prev => prev + text);
        } else if (message.serverContent?.inputTranscription) {
          const text = message.serverContent.inputTranscription.text;
          setCurrentInput(prev => prev + text);
        }

        if (message.serverContent?.turnComplete) {
          setTranscript(prev => {
            const fullInput = currentInput + (message.serverContent?.inputTranscription?.text ?? '');
            const fullOutput = currentOutput + (message.serverContent?.outputTranscription?.text ?? '');
            const newEntries = [];
            if (fullInput.trim()) newEntries.push({ speaker: 'user', text: fullInput.trim() });
            if (fullOutput.trim()) newEntries.push({ speaker: 'model', text: fullOutput.trim() });
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
            1,
          );
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.addEventListener('ended', () => {
            playbackSources.current.delete(source);
          });
          source.start(nextStartTime.current);
          nextStartTime.current += audioBuffer.duration;
          playbackSources.current.add(source);
        }

        if (message.serverContent?.interrupted) {
          playbackSources.current.forEach(source => {
            try {
              source.stop();
            } catch (e) {
              // Ignora errores
            }
          });
          playbackSources.current.clear();
          nextStartTime.current = 0;
        }
      };

      const onOpen = async (session) => {
        liveSessionRef.current = session;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
        outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const inputAudioContext = inputAudioContextRef.current;

        mediaStreamSourceRef.current = inputAudioContext.createMediaStreamSource(mediaStreamRef.current);
        scriptProcessorRef.current = inputAudioContext.createScriptProcessor(4096, 1, 1);

        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            }).catch(err => {
              console.error("Error sending realtime input:", err);
              setError("Hubo un problema al enviar el audio.");
              handleStopSession();
            });
          }
        };

        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(inputAudioContext.destination);
        setSessionState(SessionState.ACTIVE);
      };

      const onError = (e) => {
        console.error("Session error:", e);
        setError("Ocurrió un error en la conexión. Por favor, intenta de nuevo.");
        setSessionState(SessionState.ERROR);
        handleStopSession();
      };

      const onClose = () => {
        console.log("Session closed.");
        cleanupAudioResources();
        if (sessionState !== SessionState.IDLE) {
          setSessionState(SessionState.IDLE);
        }
      };

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => sessionPromiseRef.current?.then(onOpen).catch(onError),
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
      await sessionPromiseRef.current;

    } catch (err) {
      console.error("Failed to start session:", err);
      const errorMessage = err instanceof Error ? err.message : "Un error desconocido ocurrió.";
      setError(`Error al iniciar: ${errorMessage}`);
      setSessionState(SessionState.ERROR);
      cleanupAudioResources();
    }
  }, [sessionState, handleStopSession, cleanupAudioResources, currentInput, currentOutput, apiKey]);

  const handleToggleSession = () => {
    if (sessionState === SessionState.IDLE || sessionState === SessionState.ERROR) {
      handleStartSession();
    } else {
      handleStopSession();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getButtonState = () => {
    switch (sessionState) {
      case SessionState.IDLE:
      case SessionState.ERROR:
        return {
          text: "Comenzar",
          Icon: Mic,
          disabled: false,
          animate: false,
          bgColor: "bg-rose-500 hover:bg-rose-600"
        };
      case SessionState.CONNECTING:
        return {
          text: "Conectando...",
          Icon: Loader2,
          disabled: true,
          animate: true,
          bgColor: "bg-rose-400"
        };
      case SessionState.ACTIVE:
        return {
          text: "Detener",
          Icon: Square,
          disabled: false,
          animate: false,
          bgColor: "bg-gray-700 hover:bg-gray-800"
        };
      default:
        return {
          text: "...",
          Icon: Loader2,
          disabled: true,
          animate: true,
          bgColor: "bg-gray-400"
        };
    }
  };

  const { text, Icon, disabled, animate, bgColor } = getButtonState();

  return (
    <main className="bg-pink-50 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl h-[90vh] md:h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-4 border-white">
        <header className="text-center p-6 bg-white border-b border-pink-100">
          <h1 className="text-3xl font-bold text-rose-800 tracking-tight">esbelta</h1>
          <p className="text-gray-500 mt-1">Tu Asistente de Compras Personal</p>
        </header>

        <Transcript transcript={transcript} currentInput={currentInput} currentOutput={currentOutput} />

        {error && <div className="p-4 bg-red-100 text-red-700 text-center text-sm">{error}</div>}

        <footer className="p-6 bg-white border-t border-pink-100">
          <div className="relative flex flex-col items-center gap-6">
            {/* Orbe container */}
            <div className="relative">
              {/* Ondas concéntricas (solo CONNECTING) */}
              {sessionState === SessionState.CONNECTING && (
                <>
                  <div className="orb-ripple absolute inset-0" style={{ animationDelay: '0s' }} />
                  <div className="orb-ripple absolute inset-0" style={{ animationDelay: '0.5s' }} />
                  <div className="orb-ripple absolute inset-0" style={{ animationDelay: '1s' }} />
                </>
              )}

              {/* Ondas de audio (solo ACTIVE) */}
              {sessionState === SessionState.ACTIVE && (
                <div className="audio-bars-container absolute inset-0 flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="audio-bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}

              {/* Orbe principal */}
              <button
                onClick={handleToggleSession}
                disabled={disabled}
                className={`orb-button ${sessionState.toLowerCase()}`}
                aria-label={text}
              >
                <div className="orb-inner">
                  <Icon className={`orb-icon ${animate ? 'animate-spin' : ''}`} />
                </div>

                {/* Partículas flotantes (IDLE y ACTIVE) */}
                {(sessionState === SessionState.IDLE || sessionState === SessionState.ACTIVE) && (
                  <div className="particles-container absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="particle"
                        style={{
                          '--tx': `${Math.cos(i * 45 * Math.PI / 180) * 100}px`,
                          '--ty': `${Math.sin(i * 45 * Math.PI / 180) * 100}px`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            </div>

            {/* Texto del estado */}
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">{text}</p>
              {sessionState === SessionState.IDLE && (
                <p className="text-xs text-gray-400 mt-1">Presiona para comenzar</p>
              )}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};
