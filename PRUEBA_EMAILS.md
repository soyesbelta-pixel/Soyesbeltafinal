# 🧪 PRUEBA DEL SISTEMA DE EMAILS

## ✅ Estado del Sistema

**Servidor Backend:** ✅ Funcionando en http://localhost:3001
- 📧 Email Service (Resend): Ready
- API Key configurada correctamente

**Frontend:** Abrir en navegador: http://localhost:5174

---

## 📝 PASOS PARA PROBAR EL ENVÍO DE EMAILS

### 1. Abrir la aplicación
Abre en el navegador: **http://localhost:5174**

### 2. Agregar productos al carrito
- Selecciona cualquier producto
- Haz clic en "Agregar al Carrito"
- Agrega 2-3 productos diferentes

### 3. Ir al carrito y completar información
1. Abre el carrito (icono arriba derecha)
2. Haz clic en "Continuar a Información de Envío"
3. Completa el formulario con:
   - **Nombre:** Tu nombre
   - **Email:** **TU EMAIL REAL** (donde quieres recibir el correo de prueba)
   - **Teléfono:** 3123456789
   - **Departamento:** Antioquia
   - **Ciudad:** Medellín
   - **Dirección:** Calle 123 #45-67
   - **Código Postal:** 050001

### 4. Confirmar el pedido
1. Haz clic en "Confirmar Pedido (Contra Entrega)"
2. Espera el mensaje de confirmación

### 5. Verificar en consola del navegador (F12)
Deberías ver:
```
📧 Enviando email de confirmación al backend...
✅ Email enviado exitosamente: {...}
```

### 6. Verificar en consola del servidor
En la terminal del servidor deberías ver:
```
✅ Email enviado exitosamente: { id: 're_...', ... }
```

### 7. Revisar tu bandeja de entrada
- **De:** Esbelta <pedidos@esbelta.com>
- **Asunto:** Confirmación de Pedido - ORD-YYYYMMDD-XXX
- **Contenido:**
  - 🎉 ¡Pedido Confirmado!
  - Número de referencia del pedido
  - Lista de productos
  - Totales con envío
  - Información de envío
  - Botón de WhatsApp para soporte

---

## 🔍 POSIBLES PROBLEMAS Y SOLUCIONES

### ❌ Error: "RESEND_API_KEY no configurada"
**Solución:**
```bash
# Verificar que existe en server/.env
cd server
cat .env | grep RESEND_API_KEY
```

### ❌ Email no llega
**Posibles causas:**
1. **Email en spam:** Revisa la carpeta de spam/correo no deseado
2. **Email inválido:** Verifica que escribiste bien tu email
3. **Dominio no verificado en Resend:**
   - La versión gratuita de Resend solo envía a emails específicos
   - Debes verificar tu dominio o agregar tu email a la lista de destinatarios permitidos
   - Ve a: https://resend.com/domains

### ❌ Error de CORS
**Solución:** Verifica que VITE_BACKEND_URL esté configurado:
```bash
# En .env.local del frontend
VITE_BACKEND_URL=http://localhost:3001
```

### ❌ Error 500 del servidor
**Revisar logs:** Mira la consola del servidor para ver el error específico

---

## 📊 VERIFICACIÓN EN RESEND DASHBOARD

1. Accede a: https://resend.com/emails
2. Inicia sesión con tu cuenta
3. Ve a "Emails" en el menú lateral
4. Deberías ver el email enviado con:
   - Estado: "Delivered" (entregado)
   - Destinatario: Tu email
   - Asunto: Confirmación de Pedido

---

## 🎯 QUÉ ESPERAR

### Email de Confirmación de Pedido
- **Diseño:** Profesional con colores de la marca (chocolate + terracota)
- **Contenido:**
  - Header con gradiente
  - Número de referencia destacado
  - Info de pago contra entrega (si es Medellín)
  - Tabla de productos con imágenes
  - Totales (subtotal + envío + total)
  - Información de envío completa
  - Botón de WhatsApp para contacto
  - Footer con datos de contacto

### Email de Actualización de Estado
- Se envía cuando cambias el estado de un pedido desde el Admin Dashboard
- Estados: enviado, entregado, cancelado
- Contiene la referencia del pedido y mensaje según el estado

---

## 💡 CONSEJO IMPORTANTE

**⚠️ Limitación de Resend (Plan Gratuito):**
- Solo puede enviar a emails verificados
- Límite de 100 emails/día
- Dominio personalizado requiere verificación DNS

**Para producción:**
1. Verifica tu dominio personalizado en Resend
2. Configura registros DNS (SPF, DKIM, DMARC)
3. Usa un dominio profesional (no gmail.com)
4. Considera actualizar al plan de pago si necesitas más volumen

---

## ✅ CHECKLIST DE PRUEBA

- [ ] Servidor backend iniciado y funcionando
- [ ] Frontend accesible en navegador
- [ ] Productos agregados al carrito
- [ ] Formulario de envío completado correctamente
- [ ] Email REAL usado (donde puedes recibir correos)
- [ ] Pedido confirmado exitosamente
- [ ] Consola del navegador muestra "✅ Email enviado exitosamente"
- [ ] Consola del servidor muestra "✅ Email enviado exitosamente"
- [ ] Email recibido en bandeja de entrada (o spam)
- [ ] Email tiene diseño correcto y toda la información

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la consola del servidor
3. Verifica tu configuración de Resend.com
4. Verifica que el email que usas está permitido en Resend

**Archivos importantes:**
- `server/routes/emails.js` - Rutas de email del backend
- `src/services/emailService.js` - Servicio de email del frontend
- `src/services/orderService.js` - Servicio que llama al email
- `server/.env` - Variables de entorno (API keys)
