/**
 * EMAIL SERVICE - Backend Integration
 *
 * Servicio para enviar emails transaccionales a través del backend Express
 * El backend maneja la comunicación con Resend.com para evitar problemas de CORS
 */

// URL del backend (detecta automáticamente el entorno)
// Desarrollo: usa localhost:3001 | Producción: usa rutas relativas para Vercel
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
                    (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');

/**
 * Envía email de confirmación de pedido
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    console.log('📧 Enviando email de confirmación al backend...');

    const response = await fetch(`${BACKEND_URL}/api/emails/send-order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar email');
    }

    const result = await response.json();
    console.log('✅ Email enviado exitosamente:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envía email de actualización de estado de pedido
 * @param {Object} data - Datos del pedido y nuevo estado
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const sendOrderStatusUpdate = async ({ customer_email, customer_name, reference, new_status, tracking_number }) => {
  try {
    console.log('📧 Enviando email de actualización al backend...');

    const orderData = {
      reference,
      customer_email,
      customer_name
    };

    const response = await fetch(`${BACKEND_URL}/api/emails/send-status-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderData,
        newStatus: new_status,
        trackingNumber: tracking_number
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar email de actualización');
    }

    const result = await response.json();
    console.log('✅ Email de actualización enviado:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('❌ Error al enviar email de actualización:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderConfirmation,
  sendOrderStatusUpdate
};
