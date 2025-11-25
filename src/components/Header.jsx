import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Home,
  Grid,
  Heart,
  Camera,
  ArrowRight,
  Sparkles,
  Instagram,
  Facebook,
  User,
  Package
} from 'lucide-react';

// Navigation items - definido fuera del componente para estabilidad
const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', to: '/', icon: Home, img: '/hero-image.png', subtitle: '01' },
  { id: 'catalogo', label: 'Catálogo', to: '/catalogo', icon: Grid, img: '/cliente1.webp', subtitle: '02' },
  { id: 'landing', label: 'Lanzamiento', to: '/landing', icon: Sparkles, img: '/short-levanta-cola.png', subtitle: '03' },
  { id: 'probador', label: 'Probador', action: 'virtual', icon: Camera, img: '/cliente2.webp', subtitle: '04' },
  { id: 'ayuda', label: 'Ayuda', to: '/faq', icon: Heart, img: '/cliente3.webp', subtitle: '05' },
];

// ============================================
// MobileMenu - Componente separado y estable
// ============================================
const MobileMenu = ({ isOpen, onClose, onNavigate, highlightIndex }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col overflow-hidden">
      {/* Header del Menú */}
      <div className="absolute top-0 w-full p-6 z-30 flex justify-between items-center bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent">
        <div className="flex items-center gap-2">
          <span className="font-heading text-chocolate font-bold tracking-widest text-sm uppercase">Menú</span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-chocolate/10 flex items-center justify-center hover:bg-chocolate hover:text-white transition-all duration-300 group backdrop-blur-sm"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Background Image - Sin AnimatePresence */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500">
        <img
          src={NAV_ITEMS[highlightIndex]?.img || '/hero-image.png'}
          className="w-full h-full object-cover filter sepia-[0.3] opacity-[0.12]"
          alt=""
        />
        <div className="absolute inset-0 bg-[#FDFBF7] mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/90 via-transparent to-[#FDFBF7]/90" />
      </div>

      {/* Contenido Principal con Scroll */}
      <div className="flex-1 flex flex-col z-10 overflow-y-auto px-8 pt-24 pb-8 scrollbar-hide">

        {/* Barra de Búsqueda */}
        <div className="mb-10 relative">
          <input
            type="text"
            name="search"
            placeholder="Buscar productos..."
            className="w-full bg-white/50 backdrop-blur-sm border-b border-chocolate/10 px-4 py-3 pr-10 text-chocolate placeholder-chocolate/40 focus:outline-none focus:border-chocolate/30 transition-colors font-sans text-lg"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate/40" />
        </div>

        {/* Lista de Navegación Principal */}
        <div className="flex flex-col space-y-4 mb-12">
          {NAV_ITEMS.map((item, i) => {
            const isHighlighted = highlightIndex === i;
            const showRoseColor = isHighlighted;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onNavigate(item)}
                  className="block w-full text-left relative py-1 active:scale-98 transition-transform duration-150"
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`font-sans text-[0.65rem] font-bold tracking-[0.2em] transition-colors duration-700 ${showRoseColor ? 'text-rose opacity-100' : 'text-chocolate/40 opacity-60'}`}>
                      {item.subtitle}
                    </span>
                    <h2 className={`font-heading text-[2.75rem] leading-none font-medium tracking-tight transition-all duration-700 ease-out italic ${showRoseColor ? 'text-rose translate-x-2' : 'text-chocolate'}`}>
                      {item.label}
                    </h2>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Enlaces Secundarios */}
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-chocolate/5">
          <button className="flex flex-col gap-2 group">
            <div className="w-10 h-10 rounded-full bg-chocolate/5 flex items-center justify-center group-hover:bg-chocolate group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-widest text-chocolate uppercase text-left">Mi Cuenta</span>
          </button>

          <button className="flex flex-col gap-2 group">
            <div className="w-10 h-10 rounded-full bg-chocolate/5 flex items-center justify-center group-hover:bg-chocolate group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-widest text-chocolate uppercase text-left">Rastrear</span>
          </button>
        </div>
      </div>

      {/* Footer Social */}
      <div className="p-8 z-10 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent">
        <div className="flex justify-between items-end">
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-chocolate/10 flex items-center justify-center text-chocolate hover:bg-chocolate hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-chocolate/10 flex items-center justify-center text-chocolate hover:bg-chocolate hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-chocolate text-[#FDFBF7] rounded-full text-xs font-bold tracking-wide active:bg-rose-400 transition-colors">
            <span>CONTACTO</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Header Principal
// ============================================
const Header = ({ onCartOpen, onSizeAdvisorOpen, customCartCount }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const { getCartCount, setShowVirtualTryOn, productModalOpen } = useStore();
  const cartCount = customCartCount !== undefined ? customCartCount : getCartCount();

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Auto-highlight effect - solo cuando menú está abierto
  useEffect(() => {
    if (!showMobileMenu) {
      setHighlightIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setHighlightIndex(prev => (prev + 1) % NAV_ITEMS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [showMobileMenu]);

  // Handler de navegación - memoizado para estabilidad
  const handleNavClick = useCallback((item) => {
    // Cerrar menú inmediatamente
    setShowMobileMenu(false);

    // Navegar
    if (item.action === 'virtual') {
      setShowVirtualTryOn(true);
    } else {
      navigate(item.to);
    }
  }, [navigate, setShowVirtualTryOn]);

  const handleCloseMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  // Ocultar header cuando modal de producto está abierto (después de todos los hooks)
  if (productModalOpen) return null;

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm py-2' : 'bg-[#FDFBF7] py-4'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2.5 bg-white rounded-full shadow-sm text-chocolate hover:bg-rose-50 hover:text-rose-500 transition-colors border border-chocolate/5"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo-esbelta.png"
              alt="Esbelta"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-12 md:h-14'}`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-white px-2 py-1.5 rounded-full shadow-sm border border-gray-100/50">
            {NAV_ITEMS.filter(i => i.to).map(item => (
              <Link
                key={item.id}
                to={item.to}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.to
                    ? 'bg-[#FAF9F6] text-chocolate font-bold shadow-inner'
                    : 'text-chocolate/70 hover:text-chocolate hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2.5 bg-white rounded-full shadow-sm text-chocolate hover:text-rose-500 transition-colors border border-gray-100/50">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={onCartOpen}
              className="p-2.5 bg-white rounded-full shadow-sm text-chocolate hover:text-rose-500 transition-colors relative border border-gray-100/50 group"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Componente separado sin AnimatePresence */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={handleCloseMenu}
        onNavigate={handleNavClick}
        highlightIndex={highlightIndex}
      />
    </>
  );
};

export default Header;
