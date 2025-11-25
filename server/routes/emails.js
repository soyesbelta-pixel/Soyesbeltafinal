/**
 * EMAIL ROUTES - Manejo de envío de emails transaccionales
 *
 * Este módulo maneja el envío de emails desde el servidor
 * para evitar problemas de CORS y proteger la API key de Resend
 */

import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

/**
 * POST /api/emails/send-order-confirmation
 * Envía email de confirmación de pedido
 */
router.post('/send-order-confirmation', async (req, res) => {
  try {
    // Inicializar Resend (lazy initialization para evitar errores de dotenv)
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'RESEND_API_KEY no configurada en el servidor'
      });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({
        success: false,
        error: 'orderData es requerido'
      });
    }

    // Extraer datos del pedido
    const {
      reference,
      customer_email,
      customer_name,
      order_items,
      subtotal,
      shipping_cost,
      total,
      shipping_info,
      is_medellin,
      payment_method
    } = orderData;

    // Validaciones básicas
    if (!customer_email || !reference) {
      return res.status(400).json({
        success: false,
        error: 'Email y referencia son requeridos'
      });
    }

    // Generar HTML del email
    const htmlContent = generateOrderConfirmationHTML({
      reference,
      customer_name,
      order_items,
      subtotal,
      shipping_cost,
      total,
      shipping_info,
      is_medellin,
      payment_method
    });

    // Enviar email usando Resend con dominio verificado
    const response = await resend.emails.send({
      from: 'Esbelta - Pedidos <pedidos@soyesbelta.com>',
      to: customer_email,
      subject: `Confirmación de Pedido - ${reference}`,
      html: htmlContent,
    });

    console.log('✅ Email enviado exitosamente:', response);

    res.json({
      success: true,
      message: 'Email enviado correctamente',
      emailId: response.id
    });

  } catch (error) {
    console.error('❌ Error al enviar email:', error);

    res.status(500).json({
      success: false,
      error: 'Error al enviar email',
      details: error.message
    });
  }
});

/**
 * POST /api/emails/send-status-update
 * Envía email de actualización de estado de pedido
 */
router.post('/send-status-update', async (req, res) => {
  try {
    // Inicializar Resend (lazy initialization para evitar errores de dotenv)
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'RESEND_API_KEY no configurada en el servidor'
      });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { orderData, newStatus } = req.body;

    if (!orderData || !newStatus) {
      return res.status(400).json({
        success: false,
        error: 'orderData y newStatus son requeridos'
      });
    }

    const { reference, customer_email, customer_name } = orderData;

    // Mensajes según el estado
    const statusMessages = {
      enviado: {
        subject: 'Tu pedido ha sido enviado',
        message: 'Tu pedido está en camino. Recibirás tu paquete pronto.'
      },
      entregado: {
        subject: '¡Tu pedido ha sido entregado!',
        message: 'Tu pedido ha sido entregado exitosamente. ¡Esperamos que disfrutes tus productos Esbelta!'
      },
      cancelado: {
        subject: 'Tu pedido ha sido cancelado',
        message: 'Tu pedido ha sido cancelado. Si tienes preguntas, contáctanos.'
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      subject: 'Actualización de tu pedido',
      message: `El estado de tu pedido ha cambiado a: ${newStatus}`
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background-color: #F5EFE7;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3B2F2F 0%, #D27C5A 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Esbelta</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Fajas Colombianas Premium
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #3B2F2F; margin: 0 0 20px 0; font-size: 24px;">
                ${statusInfo.subject}
              </h2>

              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Hola <strong>${customer_name}</strong>,
              </p>

              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                ${statusInfo.message}
              </p>

              <div style="background-color: #F5EFE7; border-left: 4px solid #D27C5A; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #3B2F2F;">
                  <strong>Referencia del Pedido:</strong> ${reference}
                </p>
              </div>

              <p style="color: #666; line-height: 1.6; margin: 30px 0 0 0;">
                Si tienes alguna pregunta, no dudes en contactarnos:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/573147404023"
                   style="display: inline-block; background-color: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  💬 Contactar por WhatsApp
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #3B2F2F; padding: 30px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">
                © ${new Date().getFullYear()} Esbelta - Fajas Colombianas Premium
              </p>
              <p style="color: white; margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
                📞 +57 314 740 4023 | ✉️ pedidos@soyesbelta.com
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar email usando Resend con dominio verificado
    const response = await resend.emails.send({
      from: 'Esbelta - Pedidos <pedidos@soyesbelta.com>',
      to: customer_email,
      subject: `${statusInfo.subject} - ${reference}`,
      html: htmlContent,
    });

    console.log('✅ Email de actualización enviado:', response);

    res.json({
      success: true,
      message: 'Email de actualización enviado',
      emailId: response.id
    });

  } catch (error) {
    console.error('❌ Error al enviar email de actualización:', error);

    res.status(500).json({
      success: false,
      error: 'Error al enviar email',
      details: error.message
    });
  }
});

/**
 * Genera el HTML del email de confirmación de pedido
 */
function generateOrderConfirmationHTML({
  reference,
  customer_name,
  order_items = [],
  subtotal,
  shipping_cost,
  total,
  shipping_info,
  is_medellin,
  payment_method
}) {
  // Formatear precio en pesos colombianos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Generar HTML de los productos
  const productsHTML = order_items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #E5E5E5;">
        ${item.product_image ? `
          <img src="${item.product_image}"
               alt="${item.product_name}"
               style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        ` : ''}
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #E5E5E5;">
        <strong style="color: #3B2F2F;">${item.product_name}</strong><br>
        <span style="color: #666; font-size: 14px;">
          Talla: ${item.size} | Color: ${item.color || 'N/A'}<br>
          Cantidad: ${item.quantity}
        </span>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #E5E5E5; text-align: right;">
        <strong style="color: #D27C5A;">${formatPrice(item.subtotal)}</strong>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido - Esbelta</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; background-color: #F5EFE7;">
        <div style="max-width: 650px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3B2F2F 0%, #D27C5A 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
              🎉 ¡Pedido Confirmado!
            </h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">
              Esbelta - Fajas Colombianas Premium
            </p>
          </div>

          <!-- Order Reference -->
          <div style="background-color: #FFF8F0; border-left: 5px solid #D27C5A; padding: 25px 30px; margin: 30px;">
            <p style="margin: 0; color: #3B2F2F; font-size: 16px;">
              <strong style="font-size: 18px;">Número de Referencia:</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: #D27C5A; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
              ${reference}
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 0 30px 30px 30px;">
            <p style="color: #3B2F2F; font-size: 18px; margin: 0 0 10px 0;">
              Hola <strong>${customer_name}</strong>,
            </p>
            <p style="color: #666; line-height: 1.8; margin: 0 0 30px 0; font-size: 15px;">
              ¡Gracias por tu compra! Hemos recibido tu pedido correctamente y estamos preparándolo para ti.
            </p>

            <!-- Payment Info -->
            ${is_medellin ? `
              <div style="background-color: #E3F2FD; border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #2196F3;">
                <h3 style="color: #1565C0; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center;">
                  💵 Pago Contra Entrega
                </h3>
                <p style="color: #424242; line-height: 1.8; margin: 0; font-size: 15px;">
                  Tu pedido será entregado en Medellín con <strong>pago contra entrega</strong>.
                  Ten el efecto listo al momento de recibir tu pedido.
                </p>
                <p style="color: #1565C0; margin: 15px 0 0 0; font-weight: bold; font-size: 16px;">
                  Total a pagar: ${formatPrice(total)}
                </p>
              </div>
            ` : `
              <div style="background-color: #E8F5E9; border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #4CAF50;">
                <h3 style="color: #2E7D32; margin: 0 0 15px 0; font-size: 20px;">
                  ✅ Pago Procesado
                </h3>
                <p style="color: #424242; line-height: 1.8; margin: 0; font-size: 15px;">
                  Tu pago ha sido procesado exitosamente vía ePayco.
                </p>
              </div>
            `}

            <!-- Products Table -->
            <h2 style="color: #3B2F2F; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 3px solid #D27C5A; padding-bottom: 10px;">
              📦 Resumen de tu Pedido
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #F5EFE7;">
                  <th style="padding: 15px; text-align: left; color: #3B2F2F; font-size: 14px; text-transform: uppercase;">Producto</th>
                  <th style="padding: 15px; text-align: left; color: #3B2F2F; font-size: 14px; text-transform: uppercase;">Detalles</th>
                  <th style="padding: 15px; text-align: right; color: #3B2F2F; font-size: 14px; text-transform: uppercase;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productsHTML}
              </tbody>
            </table>

            <!-- Totals -->
            <div style="background-color: #FFF8F0; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #666; font-size: 16px;">Subtotal:</span>
                <span style="color: #3B2F2F; font-size: 16px; font-weight: 600;">${formatPrice(subtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #666; font-size: 16px;">Envío:</span>
                <span style="color: #3B2F2F; font-size: 16px; font-weight: 600;">
                  ${shipping_cost === 0 ? '<span style="color: #4CAF50;">GRATIS 🎁</span>' : formatPrice(shipping_cost)}
                </span>
              </div>
              <div style="border-top: 2px solid #D27C5A; padding-top: 15px; display: flex; justify-content: space-between;">
                <span style="color: #3B2F2F; font-size: 20px; font-weight: bold;">Total:</span>
                <span style="color: #D27C5A; font-size: 24px; font-weight: bold;">${formatPrice(total)}</span>
              </div>
            </div>

            <!-- Shipping Info -->
            ${shipping_info ? `
              <h2 style="color: #3B2F2F; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 3px solid #D27C5A; padding-bottom: 10px;">
                📍 Información de Envío
              </h2>
              <div style="background-color: #FAFAFA; border-radius: 12px; padding: 25px;">
                <p style="margin: 0 0 10px 0; color: #666; line-height: 1.8;">
                  <strong style="color: #3B2F2F;">Destinatario:</strong> ${shipping_info.full_name}
                </p>
                <p style="margin: 0 0 10px 0; color: #666; line-height: 1.8;">
                  <strong style="color: #3B2F2F;">Dirección:</strong> ${shipping_info.full_address}
                </p>
                <p style="margin: 0 0 10px 0; color: #666; line-height: 1.8;">
                  <strong style="color: #3B2F2F;">Ciudad:</strong> ${shipping_info.city}, ${shipping_info.department}
                </p>
                <p style="margin: 0 0 10px 0; color: #666; line-height: 1.8;">
                  <strong style="color: #3B2F2F;">Código Postal:</strong> ${shipping_info.postal_code}
                </p>
                <p style="margin: 0; color: #666; line-height: 1.8;">
                  <strong style="color: #3B2F2F;">Teléfono:</strong> ${shipping_info.phone}
                </p>
              </div>
            ` : ''}

            <!-- Support Section -->
            <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 12px; padding: 30px; margin: 40px 0; text-align: center;">
              <h3 style="color: #2E7D32; margin: 0 0 15px 0; font-size: 20px;">
                ¿Necesitas ayuda? 💬
              </h3>
              <p style="color: #424242; line-height: 1.8; margin: 0 0 20px 0; font-size: 15px;">
                Estamos aquí para ayudarte con cualquier pregunta sobre tu pedido.
              </p>
              <a href="https://wa.me/573147404023"
                 style="display: inline-block; background-color: #25D366; color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);">
                📱 Contactar por WhatsApp
              </a>
            </div>

            <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
              Recibirás actualizaciones sobre el estado de tu pedido. Guarda este correo como referencia.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #3B2F2F; padding: 40px 30px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 16px; font-weight: 600;">
              Esbelta - Fajas Colombianas Premium
            </p>
            <p style="color: rgba(255,255,255,0.8); margin: 15px 0 0 0; font-size: 14px;">
              © ${new Date().getFullYear()} Esbelta. Todos los derechos reservados.
            </p>
            <p style="color: rgba(255,255,255,0.7); margin: 10px 0 0 0; font-size: 13px;">
              📞 +57 314 740 4023 | ✉️ pedidos@esbelta.com
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export default router;
