import { useState, useRef, useEffect } from 'react';
import { Share2, Copy, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

// Icono personalizado de TikTok (SVG)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const ShareButton = ({ productName = 'Producto Esbelta', productImage = '', productId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { addNotification } = useStore();

  // Cerrar menú al hacer click/touch fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // URL a compartir (específica del producto si hay productId)
  const shareUrl = productId
    ? `${window.location.origin}/producto/${productId}`
    : window.location.href;

  // Manejar compartir - directo al menú para máxima compatibilidad
  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Intentar Web Share API primero (móvil)
    if (navigator.share && navigator.canShare) {
      const shareData = {
        title: productName,
        text: `¡Mira este producto de Esbelta! ${productName}`,
        url: shareUrl
      };

      if (navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(() => {
            addNotification({
              type: 'success',
              message: 'Compartido exitosamente'
            });
          })
          .catch((err) => {
            // Si el usuario cancela, no hacer nada
            if (err.name !== 'AbortError') {
              setIsOpen(true);
            }
          });
        return;
      }
    }

    // Fallback: mostrar menú de opciones
    setIsOpen(!isOpen);
  };

  // Funciones de compartir para cada red social
  const handleTikTokShare = () => {
    const tiktokUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(tiktokUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
    addNotification({
      type: 'info',
      message: 'Abriendo TikTok...'
    });
  };

  const handleInstagramShare = () => {
    // Instagram no soporta web sharing, así que copiamos el enlace
    navigator.clipboard.writeText(shareUrl).then(() => {
      addNotification({
        type: 'success',
        message: 'Enlace copiado. Pégalo en Instagram'
      });
      setIsOpen(false);
    }).catch(() => {
      addNotification({
        type: 'error',
        message: 'Error al copiar enlace'
      });
    });
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
    addNotification({
      type: 'info',
      message: 'Abriendo Facebook...'
    });
  };

  const handleWhatsAppShare = () => {
    const message = `¡Mira este producto de Esbelta! ${productName}\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    addNotification({
      type: 'info',
      message: 'Abriendo WhatsApp...'
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      addNotification({
        type: 'success',
        message: 'Enlace copiado al portapapeles'
      });
      setIsOpen(false);
    }).catch(() => {
      addNotification({
        type: 'error',
        message: 'Error al copiar enlace'
      });
    });
  };

  const shareOptions = [
    {
      name: 'TikTok',
      icon: TikTokIcon,
      color: 'hover:bg-black hover:text-white',
      onClick: handleTikTokShare
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white',
      onClick: handleInstagramShare
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      onClick: handleFacebookShare
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-500 hover:text-white',
      onClick: handleWhatsAppShare
    },
    {
      name: 'Copiar enlace',
      icon: Copy,
      color: 'hover:bg-esbelta-chocolate hover:text-white',
      onClick: handleCopyLink
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal de compartir */}
      <button
        type="button"
        onClick={handleShareClick}
        className="p-3 rounded-full bg-white text-esbelta-chocolate hover:scale-110 active:scale-95 transition-transform shadow-lg border border-esbelta-sand touch-manipulation cursor-pointer select-none"
        aria-label="Compartir producto"
        title="Compartir"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Share2 className="w-5 h-5 pointer-events-none" />
      </button>

      {/* Menú desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border-2 border-esbelta-sand min-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    option.onClick();
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${option.color} text-left touch-manipulation active:bg-gray-100`}
                >
                  <option.icon className="w-5 h-5 pointer-events-none" />
                  <span className="font-body font-medium text-sm pointer-events-none">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Pequeño indicador visual del producto */}
            <div className="px-4 py-2 bg-esbelta-cream border-t border-esbelta-sand">
              <p className="text-xs font-body text-esbelta-chocolate/70 truncate">
                {productName}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
