
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, StopIcon, LoadingSpinner } from './components/icons';
import { Transcript } from './components/Transcript';
import { SessionState, TranscriptEntry } from './types';
import { createBlob, decode, decodeAudioData } from './utils/audio';

const SYSTEM_INSTRUCTION = `Eres un agente de ventas experto y amigable para 'esbelta', una marca de fajas colombianas de primera calidad. Tu objetivo es guiar a las clientas, entender sus necesidades (por ejemplo, para uso diario, postparto, ocasiones especiales), y recomendarles el producto perfecto. Sé persuasiva, cálida y resalta los beneficios de las fajas, como la comodidad, la calidad de los materiales y cómo realzan la figura. Trata a cada clienta como una amiga a la que estás ayudando a sentirse más segura y bella. Utiliza un lenguaje cercano y en español.`;

const App: React.FC = () => {
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.IDLE);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentOutput, setCurrentOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const liveSessionRef = useRef<LiveSession | null>(null);

    // Audio resources
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const playbackSources = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTime = useRef<number>(0);

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

        playbackSources.current.forEach(source => source.stop());
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
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const onMessage = async (message: LiveServerMessage) => {
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
                        const newEntries: TranscriptEntry[] = [];
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
                    playbackSources.current.forEach(source => source.stop());
                    playbackSources.current.clear();
                    nextStartTime.current = 0;
                }
            };

            const onOpen = async (session: LiveSession) => {
                liveSessionRef.current = session;
                // Fix: Cast window to `any` to handle vendor-prefixed `webkitAudioContext` for Safari.
                inputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                // Fix: Cast window to `any` to handle vendor-prefixed `webkitAudioContext` for Safari.
                outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                
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

            const onError = (e: ErrorEvent) => {
                console.error("Session error:", e);
                setError("Ocurrió un error en la conexión. Por favor, intenta de nuevo.");
                setSessionState(SessionState.ERROR);
                handleStopSession();
            };

            const onClose = () => {
                console.log("Session closed.");
                cleanupAudioResources();
                if (sessionState !== SessionState.IDLE) { // Avoid setting idle if already stopped by user
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
    }, [sessionState, handleStopSession, cleanupAudioResources, currentInput, currentOutput]);

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
                return { text: "Comenzar", Icon: MicrophoneIcon, disabled: false, animate: false, bgColor: "bg-rose-500 hover:bg-rose-600" };
            case SessionState.CONNECTING:
                return { text: "Conectando...", Icon: LoadingSpinner, disabled: true, animate: true, bgColor: "bg-rose-400" };
            case SessionState.ACTIVE:
                return { text: "Detener", Icon: StopIcon, disabled: false, animate: false, bgColor: "bg-gray-700 hover:bg-gray-800" };
            default:
                return { text: "...", Icon: LoadingSpinner, disabled: true, animate: true, bgColor: "bg-gray-400" };
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
                    <button
                        onClick={handleToggleSession}
                        disabled={disabled}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-300 shadow-lg transform hover:scale-105 ${bgColor} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                        <Icon className={`w-6 h-6 ${animate ? 'animate-spin' : ''}`} />
                        <span>{text}</span>
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Presiona para hablar con tu asistente de voz Esbelta.
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default App;
