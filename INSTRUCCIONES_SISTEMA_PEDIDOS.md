# Sistema de Pedidos con Contra Entrega - Instrucciones de Configuración

Este documento contiene las instrucciones paso a paso para configurar el nuevo sistema de pedidos con pago contra entrega para Medellín.

## 🎯 Resumen del Sistema

El sistema implementado permite:
- **Pedidos Medellín**: Pago contra entrega (sin pasarela de pago)
- **Otras ciudades**: Continúa usando ePayco normalmente
- **Registro en Dashboard**: Todos los pedidos se guardan en Supabase
- **Email automático**: Confirmación enviada al cliente vía Resend (desde el servidor)
- **Gestión Admin**: Panel completo para ver y administrar pedidos

## 📋 Pasos de Configuración

### 1. Ejecutar el Script SQL en Supabase

**Archivo**: `supabase/orders-schema.sql`

**Pasos**:
1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto: kynogljhbbvagneiydrk
3. Ir a "SQL Editor" en el menú lateral
4. Crear una nueva query
5. Copiar TODO el contenido del archivo `supabase/orders-schema.sql`
6. Pegar en el editor y ejecutar (botón "Run" o Ctrl+Enter)
7. Verificar que se crearon las tablas: `orders`, `order_items`, `shipping_info`, `payments`

**Verificación**:
```sql
-- Ejecutar esta query para verificar
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('orders', 'order_items', 'shipping_info', 'payments');
```

### 2. Obtener API Key de Resend

**URL**: https://resend.com/api-keys

**Pasos**:
1. Crear cuenta en Resend (si no tienes)
2. Verificar tu dominio de email (o usar su dominio de prueba)
3. Ir a "API Keys" en el dashboard
4. Crear una nueva API Key
5. Copiar la key (empieza con `re_...`)

**Plan gratuito**:
- 100 emails/día
- 3,000 emails/mes
- Suficiente para empezar

### 3. Configurar Variable de Entorno en el Servidor

**Archivo**: `server/.env`

La API key de Resend ya está configurada en `server/.env`:
```env
RESEND_API_KEY=re_iZfDEvUw_BbNeE4os7tNPL2pdPE4guogJ
```

✅ **Ya está configurada, no necesitas hacer nada aquí.**

### 4. Iniciar el Servidor Express

El sistema de emails funciona a través del servidor Express (para evitar problemas de CORS).

**IMPORTANTE**: Necesitas tener 2 terminales abiertas:

#### Terminal 1: Servidor Backend (Express)
```bash
cd server
npm install  # Solo la primera vez
npm start    # O: node index.js
```

Deberías ver:
```
🚀 Esbelta Backend Server
📍 Running on: http://localhost:3001
🌍 Environment: development
✅ OpenRouter API: Connected
🎨 Virtual Try-On: Ready
📧 Email Service (Resend): Ready
🛡️  Rate Limiting: 20 requests/minute
```

#### Terminal 2: Frontend (Vite)
```bash
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

⚠️ **IMPORTANTE**: AMBOS servidores deben estar corriendo para que funcione el envío de emails.

## ✅ Probar el Sistema

### Flujo Completo de Prueba

1. **Asegúrate de que AMBOS servidores estén corriendo**:
   - Backend: `http://localhost:3001` (Express)
   - Frontend: `http://localhost:5173` (Vite)

2. **Ir a la página principal o landing page**
3. **Agregar productos al carrito**
4. **Proceder al checkout**
5. **En información de envío**:
   - Seleccionar departamento: "Antioquia"
   - Seleccionar ciudad: "Medellín"
6. **Verificar que aparece**:
   - Costo de envío: $10,000 (o gratis si el total > $200,000)
   - Botón azul: "Confirmar Pedido (Contra Entrega)"
   - NO debe aparecer el botón de ePayco
7. **Click en "Confirmar Pedido"**
8. **Verificar**:
   - ✅ Mensaje de confirmación con número de referencia (ej: ORD-20250112-001)
   - ✅ Email de confirmación en la bandeja (revisar spam también)
   - ✅ Carrito se vacía automáticamente
   - ✅ En la consola del servidor backend (Terminal 1) verás: "✅ Email enviado exitosamente"

### Verificar en el Dashboard Admin

1. **Ir a**: http://localhost:5173/admin
2. **Iniciar sesión** (con tus credenciales de Supabase)
3. **Click en tab "Pedidos"** (nuevo tab con ícono de bolsa)
4. **Verificar tabla de pedidos**:
   - El pedido debe aparecer con estado "Pendiente"
   - Tipo: "Contra Entrega"
   - Información completa del cliente
5. **Click en "Ver" para ver detalles completos**
6. **Probar cambio de estado**:
   - Cambiar de "Pendiente" a "Enviado"
   - Click en "Actualizar"
   - Verificar que se guardó el cambio

## 🔍 Arquitectura del Sistema

### Flujo de Datos

```
Frontend (Vite)
    ↓
orderService.js (crea pedido en Supabase)
    ↓
emailService.js (llama al backend)
    ↓
Backend Express (localhost:3001)
    ↓
/api/emails/send-order-confirmation
    ↓
Resend API
    ↓
Email al cliente
```

### ¿Por qué usar el servidor?

- **Seguridad**: La API key de Resend no se expone en el navegador
- **CORS**: Resend no permite llamadas directas desde navegadores
- **Control**: El servidor puede validar y procesar los emails antes de enviarlos

## 🔍 Estructura del Email

El email de confirmación incluye:
- **Header con branding Esbelta**
- **Número de referencia del pedido**
- **Instrucciones de pago**:
  - Para Medellín: "Pago contra entrega - Ten el efecto listo al momento de recibir tu pedido"
  - Para otras ciudades: "Pago procesado exitosamente vía ePayco"
- **Lista de productos** con imágenes
- **Desglose de costos**: Subtotal, Envío, Total
- **Información de envío completa**
- **Datos de contacto** para soporte

## 📊 Gestión de Pedidos en Dashboard

### Funcionalidades Disponibles

1. **Filtros**:
   - Por estado: Pendiente, Enviado, Entregado, Cancelado
   - Por tipo de envío: Contra Entrega Medellín, Envío Nacional
   - Búsqueda: Por referencia, nombre, email

2. **Tabla de pedidos**:
   - Referencia única
   - Información del cliente
   - Ciudad de destino
   - Total del pedido
   - Estado actual (con badge de color)
   - Tipo de envío
   - Fecha de creación

3. **Acciones**:
   - Ver detalles completos
   - Cambiar estado del pedido
   - Exportar a CSV

4. **Paginación**: 20 pedidos por página

### Estados del Pedido

- **Pendiente** (amarillo): Pedido recibido, pendiente de envío
- **Enviado** (azul): Pedido en camino al cliente
- **Entregado** (verde): Pedido entregado exitosamente
- **Cancelado** (rojo): Pedido cancelado

## 🛠️ Archivos Creados/Modificados

### Nuevos Archivos Backend
- ✅ `server/routes/emails.js` - Ruta de emails en Express
- ✅ `server/.env` - Variable RESEND_API_KEY agregada

### Nuevos Archivos Frontend
- ✅ `supabase/orders-schema.sql` - Schema de base de datos
- ✅ `src/services/emailService.js` - Servicio que llama al backend
- ✅ `src/services/orderService.js` - Servicio de pedidos
- ✅ `src/components/admin/OrdersManager.jsx` - Gestión de pedidos
- ✅ `src/components/admin/OrderDetailModal.jsx` - Modal de detalles

### Archivos Modificados
- ✅ `server/index.js` - Ruta de emails agregada
- ✅ `src/components/Cart.jsx` - Integración contra entrega
- ✅ `src/pages/ShortInvisibleLandingReact.jsx` - Landing con contra entrega
- ✅ `src/components/CartLandingModal.jsx` - Modal con contra entrega
- ✅ `src/pages/AdminDashboard.jsx` - Tab de Pedidos

## 🚨 Troubleshooting

### El email no llega

**1. Verifica que el servidor Express esté corriendo**
```bash
# En terminal 1, deberías ver:
📧 Email Service (Resend): Ready
```

**2. Revisa la consola del servidor**
- Deberías ver: `✅ Email enviado exitosamente`
- Si ves errores, léelos para identificar el problema

**3. Verifica la API key**
```bash
# En server/.env debe estar:
RESEND_API_KEY=re_iZfDEvUw_BbNeE4os7tNPL2pdPE4guogJ
```

**4. Revisa la consola del navegador (F12)**
- Deberías ver: `📧 Enviando email de confirmación al backend...`
- Luego: `✅ Email enviado exitosamente`

**5. Verifica carpeta de spam**

**6. Verifica en Resend Dashboard**
- https://resend.com/emails - Ver logs de emails enviados

### Error: "Failed to fetch"

**Causa**: El servidor Express no está corriendo o hay problema de conexión

**Solución**:
1. Asegúrate de que el servidor Express esté corriendo en puerto 3001
2. Verifica `VITE_BACKEND_URL` en `.env.local` (debe ser `http://localhost:3001`)
3. Reinicia ambos servidores

### Error CORS

**Causa**: Problemas de configuración de CORS en el servidor

**Solución**: Ya está configurado correctamente en `server/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### El pedido no se guarda en Supabase
1. Verificar que ejecutaste el SQL script correctamente
2. Revisar consola del navegador (F12) para errores
3. Verificar permisos RLS en Supabase (el script los configura automáticamente)

### El botón sigue mostrando ePayco en Medellín
1. Verificar que el departamento seleccionado es "Antioquia"
2. Verificar que la ciudad seleccionada es "Medellín"
3. Hacer hard refresh (Ctrl+Shift+R) para limpiar caché

### Error al cambiar estado del pedido
1. Verificar que estás autenticado como admin
2. Revisar consola para errores de Supabase
3. Verificar que la tabla `orders` existe y tiene los campos correctos

## 📝 Notas Importantes

1. **Servidores Necesarios**: DEBES tener 2 servidores corriendo:
   - Backend (Express): Puerto 3001
   - Frontend (Vite): Puerto 5173

2. **Dominio de Email**: Para producción, debes verificar tu dominio en Resend

3. **Rate Limits**: Plan gratuito tiene límite de 100 emails/día

4. **Testing**: Siempre probar primero con VITE_EPAYCO_TEST=true

5. **Backup**: El sistema guarda TODOS los pedidos, tanto contra entrega como online

6. **Notificaciones**: Actualmente solo se envía email al cliente, no al admin

7. **Seguridad**: La API key de Resend está segura en el servidor, no expuesta en el frontend

## 🎉 Sistema Listo

Una vez completados estos pasos, el sistema estará completamente funcional:
- ✅ Clientes de Medellín pueden pagar contra entrega
- ✅ Otras ciudades continúan con ePayco
- ✅ Todos los pedidos se registran en Supabase
- ✅ Emails de confirmación automáticos (vía servidor)
- ✅ Dashboard completo para gestión

## 📞 Soporte

Si encuentras algún problema:
1. Revisar la consola del navegador (F12)
2. Revisar logs del servidor Express (Terminal 1)
3. Revisar logs de Supabase
4. Revisar dashboard de Resend
5. Contactar al desarrollador con capturas de pantalla de los errores

## 🔧 Comandos Rápidos

```bash
# Iniciar servidor backend
cd server && npm start

# Iniciar frontend (en otra terminal)
npm run dev

# Verificar que el servidor backend está corriendo
curl http://localhost:3001/health

# Debería devolver: {"status":"ok","timestamp":"...","uptime":...}
```
