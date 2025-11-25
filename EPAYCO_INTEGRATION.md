# Integración de ePayco - Documentación Completa

## 📋 Resumen

Se ha implementado la pasarela de pagos **ePayco** en la aplicación de Esbelta, permitiendo procesar pagos con todos los métodos disponibles en Colombia.

## ✅ Métodos de Pago Disponibles

La integración soporta **todos** los métodos de pago de ePayco:

1. **Tarjetas de Crédito** - Visa, Mastercard, American Express
2. **Tarjetas de Débito** - Visa Débito, Mastercard Débito
3. **PSE** - Transferencias bancarias en línea
4. **Efectivo** - Baloto, Efecty, Gana, Puntored
5. **Daviplata** - Billetera móvil
6. **SafetyPay** - Pagos seguros internacionales

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos

1. **`src/hooks/useEPayco.js`**
   - Hook personalizado para cargar e inicializar el SDK de ePayco
   - Maneja el script asíncrono y la configuración

2. **`src/components/EPaycoCheckout.jsx`**
   - Componente principal del checkout
   - Abre el Smart Checkout de ePayco con los datos de la compra
   - Maneja callbacks de éxito y error

3. **`src/pages/PaymentResponse.jsx`**
   - Página de respuesta después del pago
   - Muestra el estado de la transacción (aprobada, rechazada, pendiente)
   - Incluye detalles del pago y acciones

4. **`api/epayco/confirmation.js`**
   - Webhook serverless para confirmación de pagos
   - Valida firmas de seguridad
   - Procesa notificaciones de ePayco

### Archivos Modificados

1. **`.env.local`** y **`.env.production`**
   - Agregadas credenciales de ePayco:
     - `VITE_EPAYCO_PUBLIC_KEY`
     - `VITE_EPAYCO_PRIVATE_KEY`
     - `VITE_EPAYCO_P_CUST_ID`
     - `VITE_EPAYCO_P_KEY`
     - `VITE_EPAYCO_TEST`

2. **`src/components/Cart.jsx`**
   - Integrado componente `EPaycoCheckout`
   - Reemplazado botón "Proceder al Pago" con el botón de ePayco
   - Agregados handlers de éxito y error de pago
   - Limpia el carrito automáticamente tras pago exitoso

3. **`src/components/PaymentGateway.jsx`**
   - Eliminado overlay de "Próximamente"
   - Actualizada lista de métodos de pago con los de ePayco
   - Mejorado diseño para mostrar métodos disponibles

4. **`src/App.jsx`**
   - Agregada ruta `/payment-response` para la página de respuesta

## 🔑 Configuración de Credenciales

### Variables de Entorno

```env
VITE_EPAYCO_PUBLIC_KEY=64a92ba3a1fb87728776c7f215177104
VITE_EPAYCO_PRIVATE_KEY=601973bd832f5b919d731c71e65cfccb
VITE_EPAYCO_P_CUST_ID=1566928
VITE_EPAYCO_P_KEY=6935bb688739314540b4499698ff2c4047074a28
VITE_EPAYCO_TEST=false
```

### Configuración en Vercel

Para producción, debes configurar estas variables en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada una de las variables con sus valores
4. Aplica para **Production** y **Preview**

## 🚀 Flujo de Pago

```
1. Usuario agrega productos al carrito
   ↓
2. Usuario hace clic en "🔒 Pagar de Forma Segura"
   ↓
3. Se abre el Smart Checkout de ePayco (modal/iframe)
   ↓
4. Usuario selecciona método de pago y completa la compra
   ↓
5. ePayco procesa el pago
   ↓
6. Usuario es redirigido a /payment-response con el resultado
   ↓
7. ePayco envía confirmación al webhook /api/epayco/confirmation
   ↓
8. El sistema procesa la confirmación (guardar en DB, enviar emails, etc.)
```

## 📊 Datos Enviados a ePayco

```javascript
{
  // Información de la compra
  name: 'Productos Esbelta',
  description: 'Lista de productos',
  invoice: 'ESB-[timestamp]',
  currency: 'cop',
  amount: 'total',

  // Configuración
  country: 'co',
  lang: 'es',
  external: 'false', // Onpage checkout

  // URLs de respuesta
  response: '[tu-dominio]/payment-response',
  confirmation: '[tu-dominio]/api/epayco/confirmation',

  // Información del cliente (opcional)
  name_billing: 'Nombre del cliente',
  mobilephone_billing: 'Teléfono',

  // Datos extra
  extra1: 'Nombre',
  extra2: 'Email',
  extra3: 'Teléfono'
}
```

## 🔐 Seguridad

### Validación de Webhook

El webhook valida la firma de seguridad de ePayco usando:

```javascript
signature = SHA256(x_ref_payco^PRIVATE_KEY^x_transaction_id^x_amount^x_currency_code)
```

### Recomendaciones

1. **NUNCA** expongas la `PRIVATE_KEY` en el frontend
2. Usa HTTPS en producción (requerido por ePayco)
3. Valida SIEMPRE la firma en el webhook
4. Loguea todas las transacciones para auditoría

## 📱 Testing

### Modo Test

Para pruebas, configura:
```env
VITE_EPAYCO_TEST=true
```

### Tarjetas de Prueba

Según documentación de ePayco:

- **Visa**: 4575623182290326
- **Mastercard**: 5254133184755089
- **American Express**: 373118856457642
- **CVV**: Cualquier 3 dígitos
- **Fecha**: Cualquier fecha futura
- **Nombre**: Cualquier nombre

### PSE de Prueba

- Banco: Banco de Prueba
- Tipo de persona: Natural
- Documento: 123456789
- Clave: 123456

## ⚠️ Puntos Importantes

### 1. Webhook Configuration

El webhook **DEBE** responder siempre con status 200, incluso si hay errores internos:

```javascript
// ✅ Correcto
return res.status(200).json({ success: true });

// ❌ Incorrecto (causará reintentos infinitos)
return res.status(500).json({ error: 'Error' });
```

### 2. Manejo de Estados

Estados de pago según `x_cod_response`:

- `1` = Aprobada
- `2` = Rechazada
- `3` = Pendiente
- `4` = Fallida

### 3. Integración con Supabase

El webhook tiene comentado el código para guardar en Supabase. Debes:

1. Crear tabla `payments` en Supabase
2. Descomentar y adaptar el código
3. Usar `VITE_SUPABASE_SERVICE_ROLE_KEY` (no la anon key)

## 📝 Próximos Pasos

### Implementación Completa

1. **Crear tabla de pagos en Supabase**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  transaction_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT,
  status TEXT,
  approval_code TEXT,
  transaction_date TIMESTAMP,
  customer_email TEXT,
  customer_name TEXT,
  extra_data JSONB,
  raw_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Descomentar código en `api/epayco/confirmation.js`**
   - Implementar guardado en Supabase
   - Agregar envío de emails de confirmación
   - Actualizar inventario si es necesario

3. **Agregar captura de datos del cliente**
   - Actualizar `customerInfo` en `Cart.jsx`
   - Crear formulario de datos de envío
   - Validar información antes del checkout

4. **Implementar descarga de recibo**
   - Generar PDF con detalles del pedido
   - Endpoint para descargar recibo

5. **Panel de administración**
   - Vista de pagos recibidos
   - Filtros por estado, fecha, monto
   - Exportación de reportes

## 🐛 Debugging

### Verificar Script cargado

```javascript
console.log('ePayco loaded:', !!window.ePayco);
```

### Ver datos enviados

Los datos enviados a ePayco se loguean en la consola del navegador.

### Ver respuesta del webhook

Vercel Logs mostrará las respuestas del webhook en tiempo real.

## 📚 Recursos

- [Documentación oficial ePayco](https://docs.epayco.com)
- [Smart Checkout](https://docs.epayco.com/docs/checkout-general)
- [API Reference](https://docs.epayco.com/docs/api)
- [Dashboard ePayco](https://dashboard.epayco.co)

## ✨ Mejoras Futuras

1. Guardar intentos de pago fallidos para análisis
2. Implementar retry automático para pagos pendientes
3. Agregar analytics de conversión
4. Implementar descuentos y cupones
5. Multi-moneda (USD, EUR)
6. Pagos recurrentes/suscripciones
7. Split payments (múltiples vendedores)

---

**Implementado por**: Claude Code
**Fecha**: Noviembre 2025
**Versión**: 1.0.0
