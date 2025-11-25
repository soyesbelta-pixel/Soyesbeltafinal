import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Droplets, 
  Ruler, 
  HelpCircle, 
  ArrowLeft, 
  X,
  ChevronRight,
  Home,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import BuyingGuide from './BuyingGuide';
import CareGuide from './CareGuide';
import FAQ from './FAQ';

const HelpCenter = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('menu');

  const sections = [
    {
      id: 'buying-guide',
      title: 'Guía de Compra',
      description: 'Encuentra la faja perfecta para ti',
      icon: BookOpen,
      color: 'from-esbelta-terracotta to-esbelta-terracotta-dark'
    },
    {
      id: 'care-guide',
      title: 'Cuidados y Mantenimiento',
      description: 'Aprende a cuidar tu faja',
      icon: Droplets,
      color: 'from-esbelta-sand to-esbelta-sand-dark'
    },
    {
      id: 'size-guide',
      title: 'Guía de Tallas',
      description: 'Encuentra tu talla perfecta',
      icon: Ruler,
      color: 'from-esbelta-chocolate to-esbelta-chocolate-dark'
    },
    {
      id: 'faq',
      title: 'Preguntas Frecuentes',
      description: 'Resuelve todas tus dudas',
      icon: HelpCircle,
      color: 'from-esbelta-sand to-esbelta-sand-dark'
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'buying-guide':
        return <BuyingGuide />;
      case 'care-guide':
        return <CareGuide />;
      case 'faq':
        return <FAQ />;
      case 'size-guide':
        return (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-esbelta-chocolate mb-8 text-center">
                Guía de Tallas
              </h2>
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-esbelta-chocolate mb-4">Cómo Medir</h3>
                    <ol className="space-y-3 text-sm text-esbelta-chocolate-light">
                      <li className="flex gap-2">
                        <span className="font-bold text-esbelta-terracotta">1.</span>
                        Usa una cinta métrica flexible
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-esbelta-terracotta">2.</span>
                        Mide tu cintura en la parte más estrecha
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-esbelta-terracotta">3.</span>
                        Mide tu cadera en la parte más ancha
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-esbelta-terracotta">4.</span>
                        Compara con nuestra tabla de tallas
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-bold text-esbelta-chocolate mb-4">Tabla de Tallas</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white">
                          <th className="p-2 text-left">Talla</th>
                          <th className="p-2 text-center">Cintura</th>
                          <th className="p-2 text-center">Cadera</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">XS</td>
                          <td className="p-2 text-center">58-63 cm</td>
                          <td className="p-2 text-center">83-88 cm</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">S</td>
                          <td className="p-2 text-center">64-69 cm</td>
                          <td className="p-2 text-center">89-94 cm</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">M</td>
                          <td className="p-2 text-center">70-75 cm</td>
                          <td className="p-2 text-center">95-100 cm</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">L</td>
                          <td className="p-2 text-center">76-81 cm</td>
                          <td className="p-2 text-center">101-106 cm</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">XL</td>
                          <td className="p-2 text-center">82-87 cm</td>
                          <td className="p-2 text-center">107-112 cm</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">XXL</td>
                          <td className="p-2 text-center">88-93 cm</td>
                          <td className="p-2 text-center">113-118 cm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white rounded-xl">
                  <p className="text-sm text-esbelta-chocolate-light">
                    <strong>💡 Consejo:</strong> Si estás entre dos tallas, elige la mayor para comodidad o la menor para más compresión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
                  Centro de Ayuda
                </h2>
                <p className="text-esbelta-chocolate-light">
                  Todo lo que necesitas saber sobre nuestras fajas
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveSection(section.id)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                          <section.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-esbelta-chocolate mb-2">
                          {section.title}
                        </h3>
                        <p className="text-sm text-esbelta-chocolate-light">
                          {section.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-esbelta-sand mt-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white text-center"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  ¿Necesitas ayuda personalizada?
                </h3>
                <p className="mb-6">
                  Nuestros asesores están disponibles para ayudarte
                </p>
                <a
                  href="https://wa.me/573147404023?text=Hola!%20Necesito%20ayuda%20con%20las%20fajas%20💬"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Chatear por WhatsApp
                  <ChevronRight className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-esbelta-sand-light flex items-center justify-between">
              <div className="flex items-center gap-4">
                {activeSection !== 'menu' && (
                  <button
                    onClick={() => setActiveSection('menu')}
                    className="p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-esbelta-chocolate" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-esbelta-chocolate">
                  {activeSection === 'menu' 
                    ? 'Centro de Ayuda' 
                    : sections.find(s => s.id === activeSection)?.title || 'Centro de Ayuda'
                  }
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-esbelta-chocolate" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-esbelta-sand-light">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-esbelta-chocolate hover:text-esbelta-terracotta transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Volver a la tienda</span>
                </button>
                {activeSection !== 'menu' && (
                  <button
                    onClick={() => setActiveSection('menu')}
                    className="text-sm font-medium text-esbelta-chocolate hover:text-esbelta-terracotta transition-colors"
                  >
                    Ver más guías
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HelpCenter;