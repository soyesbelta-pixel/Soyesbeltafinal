/**
 * TEST DE EMAIL - Script de prueba para verificar que Resend funciona
 *
 * USO:
 * 1. Reemplaza "TU_EMAIL@gmail.com" con tu email real
 * 2. Ejecuta: node test-email.js
 * 3. Revisa tu bandeja de entrada (y spam)
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ ERROR: RESEND_API_KEY no está configurada en .env');
  console.log('📝 Solución: Agrega RESEND_API_KEY=tu_api_key en server/.env');
  process.exit(1);
}

console.log('🔑 API Key detectada:', RESEND_API_KEY.substring(0, 10) + '...');
console.log('');

// Crear cliente de Resend
const resend = new Resend(RESEND_API_KEY);

// ⚠️ CAMBIA ESTE EMAIL POR TU EMAIL REAL
const TEST_EMAIL = 'TU_EMAIL@gmail.com'; // <--- CAMBIA ESTO

async function testEmail() {
  try {
    console.log('📧 Enviando email de prueba a:', TEST_EMAIL);
    console.log('');

    // Usando dominio verificado soyesbelta.com
    const response = await resend.emails.send({
      from: 'Esbelta - Pedidos <pedidos@soyesbelta.com>',
      to: TEST_EMAIL,
      subject: 'Prueba de Email - Esbelta',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px;">
              <h1 style="color: #3B2F2F; margin-bottom: 20px;">🎉 ¡Email de Prueba!</h1>

              <p style="color: #666; line-height: 1.6;">
                Este es un email de prueba desde el sistema de Esbelta.
              </p>

              <p style="color: #666; line-height: 1.6;">
                Si recibes este email, significa que:
              </p>

              <ul style="color: #666; line-height: 1.8;">
                <li>✅ Resend API está funcionando correctamente</li>
                <li>✅ Tu email está permitido en Resend</li>
                <li>✅ El servidor puede enviar emails</li>
              </ul>

              <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #2E7D32; margin: 0; font-weight: bold;">
                  ✅ Sistema de emails funcionando correctamente
                </p>
              </div>

              <p style="color: #999; font-size: 12px; margin-top: 40px;">
                Enviado por: Sistema de prueba de Esbelta<br>
                Fecha: ${new Date().toLocaleString('es-CO')}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ EMAIL ENVIADO EXITOSAMENTE!');
    console.log('');
    console.log('📊 Detalles de la respuesta:');
    console.log('   ID:', response.id);
    console.log('   Destinatario:', TEST_EMAIL);
    console.log('');
    console.log('📬 AHORA REVISA TU BANDEJA DE ENTRADA');
    console.log('   ⚠️  Si no aparece, revisa la carpeta de SPAM');
    console.log('');
    console.log('🌐 También puedes verificar en Resend Dashboard:');
    console.log('   https://resend.com/emails');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR AL ENVIAR EMAIL:');
    console.error('');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('');

    if (error.message.includes('API key')) {
      console.log('🔑 PROBLEMA: API key inválida');
      console.log('   Solución: Verifica que RESEND_API_KEY sea correcta en server/.env');
    } else if (error.message.includes('domain')) {
      console.log('🌐 PROBLEMA: Dominio no verificado');
      console.log('   Solución: Verifica tu dominio en https://resend.com/domains');
    } else if (error.message.includes('audience') || error.message.includes('email')) {
      console.log('📧 PROBLEMA: Email no permitido');
      console.log('   Solución: En plan gratuito de Resend, solo puedes enviar a emails específicos');
      console.log('   1. Ve a: https://resend.com/settings/audiences');
      console.log('   2. Agrega tu email a la lista de destinatarios permitidos');
    }

    console.log('');
    process.exit(1);
  }
}

// Ejecutar prueba
console.log('🧪 TEST DE EMAIL - Esbelta');
console.log('================================');
console.log('');

testEmail();
