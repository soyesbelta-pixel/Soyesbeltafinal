import { Resend } from 'resend';

// Instancia única compartida entre invocaciones (Vercel cachea esto)
let resendInstance = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    const { orderData, newStatus } = req.body;

    // Validación de entrada
    if (!orderData || !newStatus) {
      return res.status(400).json({
        success: false,
        error: 'orderData y newStatus son requeridos'
      });
    }

    const { reference, customer_email, customer_name } = orderData;

    // Validación de email
    if (!customer_email || !reference) {
      return res.status(400).json({
        success: false,
        error: 'Email y referencia son requeridos'
      });
    }

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

    // Obtener servicio Resend
    const resend = getResend();

    // Enviar email usando Resend con dominio verificado
    const response = await resend.emails.send({
      from: 'Esbelta - Pedidos <pedidos@soyesbelta.com>',
      to: customer_email,
      subject: `${statusInfo.subject} - ${reference}`,
      html: htmlContent,
    });

    console.log('✅ Email de actualización enviado:', response);

    res.status(200).json({
      success: true,
      message: 'Email de actualización enviado',
      emailId: response.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error al enviar email de actualización:', error);

    res.status(500).json({
      success: false,
      error: 'Error al enviar email',
      details: error.message
    });
  }
}
