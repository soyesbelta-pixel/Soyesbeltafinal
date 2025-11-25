import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, Home, Receipt } from 'lucide-react';

const PaymentResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Obtener datos de la respuesta de ePayco
    const ref_payco = searchParams.get('ref_payco');
    const transactionId = searchParams.get('x_transaction_id');
    const amount = searchParams.get('x_amount');
    const currency = searchParams.get('x_currency_code');
    const codResponse = searchParams.get('x_cod_response');
    const response = searchParams.get('x_response');
    const approval_code = searchParams.get('x_approval_code');
    const transaction_date = searchParams.get('x_transaction_date');

    setPaymentData({
      refPayco: ref_payco,
      transactionId,
      amount,
      currency,
      codResponse,
      response,
      approvalCode: approval_code,
      transactionDate: transaction_date
    });
  }, [searchParams]);

  const getStatus = () => {
    if (!paymentData) return null;

    const { codResponse } = paymentData;

    switch (codResponse) {
      case '1': // Aprobada
        return {
          type: 'success',
          icon: CheckCircle,
          title: '¡Pago Aprobado!',
          message: 'Tu pago ha sido procesado exitosamente',
          color: 'green'
        };
      case '2': // Rechazada
        return {
          type: 'error',
          icon: XCircle,
          title: 'Pago Rechazado',
          message: 'Tu pago no pudo ser procesado',
          color: 'red'
        };
      case '3': // Pendiente
        return {
          type: 'pending',
          icon: Clock,
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado',
          color: 'yellow'
        };
      case '4': // Fallida
        return {
          type: 'failed',
          icon: XCircle,
          title: 'Pago Fallido',
          message: 'Ocurrió un error durante el proceso de pago',
          color: 'red'
        };
      default:
        return {
          type: 'unknown',
          icon: AlertCircle,
          title: 'Estado Desconocido',
          message: 'No se pudo determinar el estado del pago',
          color: 'gray'
        };
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-esbelta-cream to-white">
        <div className="animate-pulse">
          <Clock className="w-16 h-16 text-esbelta-chocolate mx-auto mb-4" />
          <p className="text-esbelta-chocolate">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-esbelta-cream to-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className={`w-24 h-24 mx-auto rounded-full bg-${status.color}-100 flex items-center justify-center`}>
            <status.icon className={`w-12 h-12 text-${status.color}-600`} />
          </div>
        </motion.div>

        {/* Title and Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-esbelta-chocolate mb-4 text-center">
          {status.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          {status.message}
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Referencia:</span>
            <span className="font-bold text-esbelta-chocolate">{paymentData.refPayco}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ID Transacción:</span>
            <span className="font-bold text-esbelta-chocolate">{paymentData.transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monto:</span>
            <span className="font-bold text-esbelta-chocolate">
              ${new Intl.NumberFormat('es-CO').format(paymentData.amount)} {paymentData.currency}
            </span>
          </div>
          {paymentData.approvalCode && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Código de Aprobación:</span>
              <span className="font-bold text-esbelta-chocolate">{paymentData.approvalCode}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-bold text-esbelta-chocolate">
              {new Date(paymentData.transactionDate).toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </button>

          {status.type === 'success' && (
            <button
              onClick={() => {
                // Aquí podrías implementar la descarga del recibo
                console.log('Descargar recibo:', paymentData.refPayco);
              }}
              className="flex-1 border-2 border-esbelta-chocolate text-esbelta-chocolate font-bold py-3 px-6 rounded-xl hover:bg-esbelta-chocolate hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              Descargar Recibo
            </button>
          )}
        </div>

        {/* Additional Info */}
        {status.type === 'success' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Recibirás un correo de confirmación con los detalles de tu compra
            </p>
            <p className="text-xs text-gray-500">
              Si tienes alguna pregunta, contáctanos por WhatsApp
            </p>
          </div>
        )}

        {status.type === 'pending' && (
          <div className="mt-8 text-center bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Tu pago está siendo verificado. Te notificaremos cuando se confirme.
            </p>
          </div>
        )}

        {(status.type === 'error' || status.type === 'failed') && (
          <div className="mt-8 text-center bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-2">
              {paymentData.response}
            </p>
            <p className="text-xs text-red-600">
              Intenta nuevamente o contacta con soporte
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentResponse;
