import { useEffect, useState } from 'react';

/**
 * Hook para integrar ePayco Smart Checkout
 * @returns {Object} handler de ePayco y estado de carga
 */
export const useEPayco = () => {
  const [ePaycoHandler, setEPaycoHandler] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el script ya está cargado
    if (window.ePayco) {
      initializeEPayco();
      return;
    }

    // Cargar el script de ePayco
    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.async = true;
    script.setAttribute('data-epayco-key', import.meta.env.VITE_EPAYCO_PUBLIC_KEY);

    script.onload = () => {
      initializeEPayco();
    };

    script.onerror = () => {
      console.error('Error al cargar el script de ePayco');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeEPayco = () => {
    if (window.ePayco) {
      const handler = window.ePayco.checkout.configure({
        key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
        test: import.meta.env.VITE_EPAYCO_TEST === 'true'
      });
      setEPaycoHandler(handler);
      setIsLoading(false);
    }
  };

  /**
   * Abre el checkout de ePayco con los datos de la compra
   * @param {Object} data - Datos de la transacción
   */
  const openCheckout = (data) => {
    if (!ePaycoHandler) {
      console.error('ePayco handler no está inicializado');
      return;
    }

    ePaycoHandler.open(data);
  };

  return {
    openCheckout,
    isLoading,
    isReady: !!ePaycoHandler
  };
};
