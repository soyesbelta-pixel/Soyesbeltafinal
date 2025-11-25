import { useEffect } from 'react';
import { useEPayco } from '../hooks/useEPayco';
import { Loader2 } from 'lucide-react';

/**
 * Componente para integrar ePayco Checkout
 * Soporta todos los métodos de pago disponibles en Colombia:
 * - Tarjetas de crédito/débito
 * - PSE (Transferencias bancarias)
 * - Efectivo (Baloto, Efecty, etc.)
 * - Daviplata
 * - SafetyPay
 */
const EPaycoCheckout = ({
  cartItems,
  total,
  customerInfo,
  onSuccess,
  onError,
  onClose,
  onBeforeOpen,
  autoOpen = false
}) => {
  const { openCheckout, isLoading, isReady } = useEPayco();

  useEffect(() => {
    if (autoOpen && isReady && cartItems.length > 0) {
      handleCheckout();
    }
  }, [autoOpen, isReady]);

  const handleCheckout = () => {
    if (!isReady) {
      console.error('ePayco no está listo');
      return;
    }

    // Validar antes de abrir si existe callback
    if (onBeforeOpen) {
      const isValid = onBeforeOpen();
      if (!isValid) {
        return; // No abrir checkout si validación falla
      }
    }

    // Preparar descripción de productos
    const productDescriptions = cartItems
      .map(item => `${item.name} (${item.size}) x${item.quantity}`)
      .join(', ');

    // Preparar datos para ePayco
    const checkoutData = {
      //Parametros compra (obligatorios)
      name: 'Productos Esbelta',
      description: productDescriptions,
      invoice: `ESB-${Date.now()}`, // Número de factura único
      currency: 'cop',
      amount: total.toString(),
      tax_base: '0',
      tax: '0',
      country: 'co',
      lang: 'es',

      //Onpage='false' - Standard='true'
      external: 'false',

      //Atributos opcionales
      extra1: customerInfo?.name || '',
      extra2: customerInfo?.email || '',
      extra3: customerInfo?.phone || '',

      // Cliente
      name_billing: customerInfo?.name || '',
      address_billing: customerInfo?.address || '',
      type_doc_billing: 'cc', // cc, nit, otro
      mobilephone_billing: customerInfo?.phone || '',
      number_doc_billing: customerInfo?.document || '',

      // Respuesta
      response: window.location.origin + '/payment-response',
      confirmation: window.location.origin + '/api/epayco/confirmation',

      // Métodos de pago habilitados (todos por defecto)
      methodsDisable: [], // Dejar vacío para habilitar todos

      // Callback handlers
      onResponse: function(response) {
        console.log('ePayco Response:', response);

        if (response.success) {
          // Pago exitoso
          if (onSuccess) {
            onSuccess({
              transactionId: response.x_ref_payco,
              referenceCode: response.x_transaction_id,
              status: response.x_cod_response,
              amount: response.x_amount,
              currency: response.x_currency_code,
              date: response.x_transaction_date,
              response: response
            });
          }
        } else {
          // Pago fallido o pendiente
          if (onError) {
            onError({
              message: response.x_response_reason_text || 'Error en la transacción',
              code: response.x_cod_response,
              response: response
            });
          }
        }
      }
    };

    // Abrir checkout
    openCheckout(checkoutData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-esbelta-terracotta" />
        <span className="ml-2 text-esbelta-chocolate">Cargando pasarela de pago...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={!isReady || cartItems.length === 0}
      className="w-full bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {!isReady ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Iniciando...
        </>
      ) : (
        <>
          🔒 Pagar de Forma Segura
        </>
      )}
    </button>
  );
};

export default EPaycoCheckout;
