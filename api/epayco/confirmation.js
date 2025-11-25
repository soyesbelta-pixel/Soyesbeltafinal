/**
 * Webhook de confirmación de ePayco
 * Este endpoint es llamado por ePayco para confirmar el estado del pago
 * Documentación: https://docs.epayco.com/docs/webhook
 */

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const paymentData = req.body;

    console.log('📥 Webhook de ePayco recibido:', paymentData);

    // Validar firma de seguridad (importante para producción)
    const signature = paymentData.x_signature;
    const expectedSignature = generateSignature(paymentData);

    if (signature !== expectedSignature) {
      console.error('❌ Firma inválida');
      return res.status(400).json({ error: 'Firma inválida' });
    }

    // Extraer información del pago
    const {
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_cod_response,
      x_response,
      x_approval_code,
      x_transaction_date,
      x_customer_email,
      x_customer_name,
      x_extra1,
      x_extra2,
      x_extra3
    } = paymentData;

    // Determinar estado del pago
    let paymentStatus = 'pending';
    switch (x_cod_response) {
      case '1':
        paymentStatus = 'approved';
        break;
      case '2':
        paymentStatus = 'rejected';
        break;
      case '3':
        paymentStatus = 'pending';
        break;
      case '4':
        paymentStatus = 'failed';
        break;
    }

    console.log(`💳 Pago ${paymentStatus}: ${x_ref_payco}`);

    // Aquí deberías:
    // 1. Guardar el pago en Supabase
    // 2. Actualizar el estado del pedido
    // 3. Enviar correos de confirmación
    // 4. Actualizar inventario si es necesario

    // Ejemplo de guardar en Supabase (debes implementar esto):
    /*
    import { createClient } from '@supabase/supabase-js';

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('payments')
      .insert({
        reference: x_ref_payco,
        transaction_id: x_transaction_id,
        amount: parseFloat(x_amount),
        currency: x_currency_code,
        status: paymentStatus,
        approval_code: x_approval_code,
        transaction_date: x_transaction_date,
        customer_email: x_customer_email,
        customer_name: x_customer_name,
        extra_data: {
          extra1: x_extra1,
          extra2: x_extra2,
          extra3: x_extra3
        },
        raw_response: paymentData
      });

    if (error) {
      console.error('Error guardando pago en Supabase:', error);
      // No retornar error a ePayco, pero loguearlo
    }
    */

    // Responder a ePayco (SIEMPRE responder 200 para evitar reintentos)
    return res.status(200).json({
      success: true,
      message: 'Pago procesado correctamente'
    });

  } catch (error) {
    console.error('❌ Error procesando webhook de ePayco:', error);

    // IMPORTANTE: Siempre responder 200 a ePayco para evitar reintentos infinitos
    // Loguear el error internamente para debugging
    return res.status(200).json({
      success: false,
      message: 'Error procesado internamente'
    });
  }
}

/**
 * Genera la firma de seguridad para validar el webhook
 * @param {Object} data - Datos del webhook
 * @returns {string} Firma generada
 */
function generateSignature(data) {
  const crypto = require('crypto');

  // Los campos usados para la firma según documentación de ePayco
  const {
    x_ref_payco,
    x_transaction_id,
    x_amount,
    x_currency_code
  } = data;

  const privateKey = process.env.VITE_EPAYCO_PRIVATE_KEY;

  // Concatenar valores según documentación
  const signatureString = `${x_ref_payco}^${privateKey}^${x_transaction_id}^${x_amount}^${x_currency_code}`;

  // Generar hash SHA256
  return crypto
    .createHash('sha256')
    .update(signatureString)
    .digest('hex');
}
