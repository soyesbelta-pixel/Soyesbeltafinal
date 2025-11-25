import { useEffect, useState, lazy, Suspense } from 'react';
import Header from './Header';
import SiteFooter from './SiteFooter';
import Notifications from './Notifications';
import useStore from '../store/useStore';

const HelpCenter = lazy(() => import('./HelpCenter'));
const Cart = lazy(() => import('./Cart'));
const SizeAdvisor = lazy(() => import('./SizeAdvisor'));
const ChatBot = lazy(() => import('./ChatBot'));
const VirtualTryOnModal = lazy(() => import('./VirtualTryOnModal'));
const EmailPopup = lazy(() => import('./EmailPopup'));

const PageLayout = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [showSizeAdvisor, setShowSizeAdvisor] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const { showVirtualTryOn, setShowVirtualTryOn } = useStore();

  // Limpiar notificaciones persistidas antiguas
  useEffect(() => {
    const storage = localStorage.getItem('silueta-dorada-storage');
    if (storage) {
      try {
        const data = JSON.parse(storage);
        if (data.state && data.state.notifications) {
          delete data.state.notifications;
          localStorage.setItem('silueta-dorada-storage', JSON.stringify(data));
        }
      } catch (e) {
        console.error('Error cleaning notifications from storage:', e);
      }
    }
  }, []);

  const renderContent =
    typeof children === 'function'
      ? children({
          openCart: () => setShowCart(true),
          openSizeAdvisor: () => setShowSizeAdvisor(true),
          openHelpCenter: () => setShowHelpCenter(true),
        })
      : children;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header
        onCartOpen={() => setShowCart(true)}
        onSizeAdvisorOpen={() => setShowSizeAdvisor(true)}
      />

      {renderContent}

      <SiteFooter />

      <Suspense fallback={null}>
        <HelpCenter isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} />
      </Suspense>

      <AnimatePresenceModals
        showCart={showCart}
        onCloseCart={() => setShowCart(false)}
        showSizeAdvisor={showSizeAdvisor}
        onCloseSizeAdvisor={() => setShowSizeAdvisor(false)}
        showVirtualTryOn={showVirtualTryOn}
        onCloseVirtual={() => setShowVirtualTryOn(false)}
      />

      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>

      <Notifications />

      <Suspense fallback={null}>
        <EmailPopup />
      </Suspense>
    </div>
  );
};

const AnimatePresenceModals = ({
  showCart,
  onCloseCart,
  showSizeAdvisor,
  onCloseSizeAdvisor,
  showVirtualTryOn,
  onCloseVirtual,
}) => {
  return (
    <Suspense fallback={null}>
      {showCart && <Cart onClose={onCloseCart} />}
      {showSizeAdvisor && <SizeAdvisor onClose={onCloseSizeAdvisor} />}
      {showVirtualTryOn && <VirtualTryOnModal isOpen={showVirtualTryOn} onClose={onCloseVirtual} />}
    </Suspense>
  );
};

export default PageLayout;
