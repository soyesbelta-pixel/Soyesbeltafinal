import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { MessageCircle, X, Send, Sparkles, Loader2, ChevronRight } from "lucide-react";
import useStore from "../store/useStore";
import OpenRouterService from "../services/OpenRouterService";
import { products } from "../data/products";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [userClosedQuickReplies, setUserClosedQuickReplies] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // Estado para el tooltip cíclico
  const messagesEndRef = useRef(null);
  const quickRepliesRef = useRef(null);

  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const addNotification = useStore((state) => state.addNotification);
  const productModalOpen = useStore((state) => state.productModalOpen);

  // Ciclo de vida del Tooltip: 5s visible, 10s invisible
  useEffect(() => {
    let timeout;
    
    const runTooltipCycle = () => {
      setIsTooltipVisible(true); // Aparece
      
      // Desaparece a los 5 segundos
      timeout = setTimeout(() => {
        setIsTooltipVisible(false);
        
        // Vuelve a aparecer a los 10 segundos (15s total desde el inicio)
        timeout = setTimeout(runTooltipCycle, 10000);
      }, 5000);
    };

    // Iniciar ciclo (con un pequeño delay inicial de cortesía)
    const startTimeout = setTimeout(runTooltipCycle, 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(startTimeout);
    };
  }, []);

  // Mensaje inicial de bienvenida
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = "Buenos días";
    else if (hour < 18) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    const initialMessage = {
      id: Date.now(),
      type: "bot",
      content: `${greeting}, soy Nicole, tu asesora de Esbelta - Fajas Colombianas Premium.\n\nTenemos **-10% de descuento** en toda la colección.\n\n¿Qué zona del cuerpo quieres moldear? Te ayudo a seleccionar el producto perfecto para ti.`,
      timestamp: new Date().toISOString(),
    };

    setMessages([initialMessage]);
  }, []);

  // Pop-up teaser para invitar a usar el agente (Este es el teaser grande, independiente del tooltip)
  useEffect(() => {
    const showTimer = setTimeout(() => setShowTeaser(true), 6000);
    const hideTimer = setTimeout(() => setShowTeaser(false), 20000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      setIsTooltipVisible(false); // Ocultar tooltip si se abre el chat
    }
  }, [isOpen]);

  // Scroll automático al final del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (content) => {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return formatted
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p class="mb-2 last:mb-0">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  };

  const quickReplies = [
    { id: 1, label: "Control de abdomen", icon: "💪", action: "control abdomen" },
    { id: 2, label: "Levanta cola / Glúteos", icon: "✨", action: "levanta cola" },
    { id: 3, label: "Moldeadora completa", icon: "⏳", action: "moldeadora completa" },
    { id: 4, label: "Ver catálogo completo", icon: "📦", action: "ver todos los productos" },
  ];

  const handleQuickReply = async (reply) => {
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: [reply.label, reply.icon].filter(Boolean).join(' '),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      let response;
      if (reply.action === "tallas") {
        response = "Te puedo ayudar con las tallas! 📏\n\nContamos con tallas desde **XS hasta XXL**. Para elegir la talla correcta:\n\n1. **Mide tu cintura** en el punto más estrecho\n2. **Mide tus caderas** en la parte más ancha\n3. Consulta nuestra **Guía de Tallas** en el menú\n\n¿Conoces tus medidas? Puedo recomendarte la talla perfecta.";
      } else if (reply.action === "ofertas") {
        const offerProducts = products.filter((p) => p.discount > 25);
        response = `🎉 **¡Ofertas Especiales de Hoy!**\n\n${offerProducts
          .slice(0, 3)
          .map(
            (p) =>
              `• **${p.name}**\n  💰 ~$${p.originalPrice.toLocaleString()}~ **$${p.price.toLocaleString()} MXN**\n  ¡${p.discount}% de descuento!\n`
          )
          .join("\n")}\n\n¿Te interesa alguna de estas ofertas?`;
      } else {
        response = await OpenRouterService.sendMessage(
          `Muéstrame las mejores fajas de la categoría ${reply.action}`,
          { currentPage: "chat" }
        );
      }

      const botMessage = {
        id: Date.now(),
        type: "bot",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setShowQuickReplies(!userClosedQuickReplies);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      const context = {
        currentPage: window.location.pathname,
        cartItems: cart,
        timestamp: new Date().toISOString(),
      };

      const response = await OpenRouterService.sendMessage(inputMessage, context);

      const productMentions = products.filter((p) =>
        response.toLowerCase().includes(p.name.toLowerCase())
      );

      const botMessage = {
        id: Date.now(),
        type: "bot",
        content: response,
        timestamp: new Date().toISOString(),
        products: productMentions.slice(0, 2),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setShowQuickReplies(!userClosedQuickReplies);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo? 😊",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleAddToCart = (product, size) => {
    addToCart({ ...product, size });
    addNotification({
      type: "success",
      message: `${product.name} agregado al carrito`,
    });
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  // Ocultar ChatBot cuando hay un modal de producto abierto
  if (productModalOpen) return null;

  return (
    <>
      {/* BOTÓN FLOTANTE "STORY STYLE" - COLOR #F88379 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] group cursor-pointer isolate"
        style={{ contain: 'layout style' }}
        aria-label={isOpen ? "Cerrar asesor" : "Abrir asesor"}
      >
        <div className="absolute -inset-1 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 transition-opacity animate-spin-slow pointer-events-none" style={{ background: 'conic-gradient(from 0deg, #F88379, #ffffff, #F88379)' }}></div>
        
        <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white shadow-xl">
          {/* Sin AnimatePresence - transición CSS */}
          {isOpen ? (
            <div
              className="w-full h-full flex items-center justify-center text-white transition-all duration-200"
              style={{ backgroundColor: '#F88379' }}
            >
              <X className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden">
              <video
                src="/sofia-avatar.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-top scale-150"
                style={{ objectPosition: 'center 15%' }}
              />
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Tooltip cíclico - Sin AnimatePresence */}
        {!isOpen && isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full right-12 mb-2 bg-white px-3 py-1.5 rounded-xl rounded-br-none shadow-md border border-esbelta-sand/20 whitespace-nowrap pointer-events-none origin-bottom-right"
          >
            <span className="text-[10px] font-bold" style={{ color: '#F88379' }}>Hola! ¿Te ayudo? 👋</span>
          </motion.div>
        )}
      </motion.button>

      {/* VENTANA DE CHAT PRINCIPAL - Sin AnimatePresence */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-[60] w-[380px] max-w-[calc(100vw-32px)] h-[500px] md:h-[600px] max-h-[70vh] md:max-h-[80vh] flex flex-col bg-[#FAFAFA] rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 isolate"
          style={{ contain: 'layout' }}
        >
            {/* HEADER - COLOR ORIGINAL */}
            <div className="relative px-6 py-5 overflow-hidden shrink-0" style={{ backgroundColor: 'rgba(248, 131, 121, 0.95)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-white/30 p-0.5 bg-white/10 backdrop-blur-sm">
                    <img src="/nicole-avatar.png" alt="Nicole" className="w-full h-full rounded-full object-cover bg-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 text-white">
                  <h3 className="font-heading font-bold text-xl leading-none mb-1">Nicole</h3>
                  <p className="text-xs text-white/90 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    Asesora de Estilo
                  </p>
                </div>
                <button 
                  onClick={toggleChat} 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MENSAJES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FAFAFA] relative">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} relative z-10`}
                >
                  <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${ 
                        message.type === "user"
                          ? "text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                      }`}
                      style={message.type === "user" ? { backgroundColor: '#F88379' } : {}}
                    >
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                    </div>

                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 group cursor-pointer hover:border-[#F88379]/30 transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg bg-gray-50"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-gray-800 truncate">{product.name}</h4>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-sm font-bold" style={{ color: '#F88379' }}>${product.price.toLocaleString()}</span>
                                {product.discount > 0 && (
                                  <span className="text-[10px] text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                              <button
                                onClick={() => handleAddToCart(product, product.sizes[0])}
                                className="mt-2 w-full text-[10px] font-bold text-white py-1.5 rounded transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#F88379' }}
                              >
                                Agregar
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-[10px] mt-1.5 px-1 opacity-50 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(message.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT Y SUGERENCIAS */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0 relative z-20">
              {showQuickReplies && !isTyping && (
                <div className="absolute bottom-full left-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent pb-6">
                  <div 
                    ref={quickRepliesRef}
                    className="flex gap-2 overflow-x-auto snap-x pb-2"
                    style={{ 
                      scrollbarWidth: 'thin', 
                      scrollbarColor: 'rgba(248, 131, 121, 0.3) transparent'
                    }}
                  >
                    {quickReplies.map((reply) => (
                      <motion.button
                        key={reply.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(reply)}
                        className="shrink-0 snap-center bg-white border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-full shadow-sm hover:border-[#F88379] hover:text-[#F88379] transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        <span>{reply.icon}</span>
                        {reply.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-[#F88379]/50 focus-within:bg-white focus-within:shadow-sm transition-all">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`p-2 rounded-full transition-all ${ 
                    inputMessage.trim() 
                      ? 'text-white shadow-md hover:scale-105' 
                      : 'text-gray-300 bg-transparent cursor-not-allowed'
                  }`}
                  style={inputMessage.trim() ? { backgroundColor: '#F88379' } : {}}
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-300">Powered by Esbelta AI</p>
              </div>
            </div>
          </motion.div>
        )}
    </>
  );
};

export default ChatBot;
