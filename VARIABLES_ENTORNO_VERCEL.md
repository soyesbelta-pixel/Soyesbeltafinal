# Variables de Entorno para Vercel - Documentación Completa

## 📋 Instrucciones de Importación

### Opción 1: Importar archivo .env (Recomendado)
1. Abre el archivo `.env.vercel` en tu editor
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
4. Haz clic en "Import .env" o busca la opción "paste the .env contents above"
5. Pega el contenido completo
6. Selecciona los ambientes: **Production**, **Preview**, **Development**
7. Haz clic en "Import"

### Opción 2: Agregar manualmente
Si prefieres agregar una por una, usa la tabla de referencia más abajo.

---

## 🔐 Variables de Entorno Requeridas

### 1. Backend Serverless Functions

Estas variables son usadas por las funciones serverless en `/api/`:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_iZfDEvUw_BbNeE4os7tNPL2pdPE4guogJ` | API key de Resend para envío de emails transaccionales |

**Funciones que usan estas variables:**
- `/api/emails/send-order-confirmation.js` → usa `RESEND_API_KEY`
- `/api/emails/send-status-update.js` → usa `RESEND_API_KEY`

---

### 2. Supabase (Base de Datos)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://kynogljhbbvagneiydrk.supabase.co` | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Key pública para operaciones del cliente |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Key de servicio para operaciones admin |

**Uso:**
- Almacenamiento de productos, pedidos, usuarios
- Virtual Try-On leads
- Admin Dashboard

---

### 3. AI Services (Inteligencia Artificial)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyCxXaym91rwecKTwiM_0-rE0pjC9OwmIxs` | API key de Google Gemini (backend) |
| `VITE_GEMINI_API_KEY` | `AIzaSyCxXaym91rwecKTwiM_0-rE0pjC9OwmIxs` | API key de Google Gemini (frontend) |
| `OPENROUTER_API_KEY` | `sk-or-v1-63153e5462ca371b10fe...` | API key de OpenRouter |
| `AI_PROVIDER` | `openrouter` | Proveedor de AI principal |

**Uso:**
- Asistente de voz en landing pages
- ChatBot de soporte al cliente
- Virtual Try-On AI

---

### 4. ePayco (Pasarela de Pago)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_EPAYCO_PUBLIC_KEY` | `64a92ba3a1fb87728776c7f215177104` | Llave pública de ePayco |
| `VITE_EPAYCO_PRIVATE_KEY` | `601973bd832f5b919d731c71e65cfccb` | Llave privada de ePayco |
| `VITE_EPAYCO_P_CUST_ID` | `1566928` | ID de cliente en ePayco |
| `VITE_EPAYCO_P_KEY` | `6935bb688739314540b4499698ff2c4047074a28` | P-Key de ePayco |
| `VITE_EPAYCO_TEST` | `false` | Modo de prueba (false = producción) |

**Uso:**
- Procesamiento de pagos online
- Alternativa a pago contra entrega para clientes fuera de Medellín

---


### 6. Feature Flags

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_USE_SUPABASE` | `true` | Habilita uso de Supabase para productos |

---

## ⚠️ Variables NO Necesarias en Vercel

Estas variables son SOLO para desarrollo local:

- ❌ `VITE_BACKEND_URL` - NO configurar en Vercel (se detecta automáticamente)
- ❌ `PORT` - Vercel asigna puertos automáticamente
- ❌ `NODE_ENV` - Vercel lo configura automáticamente
- ❌ `FRONTEND_URL` - No necesario en producción

---

## 🎯 Verificación Post-Importación

Después de importar las variables en Vercel:

### 1. Verificar en Dashboard
Ve a: Settings → Environment Variables

Deberías ver **19 variables** configuradas para Production, Preview y Development.

### 2. Verificar en el Deployment
Después del siguiente deployment, revisa los logs:

```
Vercel Dashboard → Deployments → Latest → Function Logs
```

Busca mensajes como:
- ✅ `Email enviado exitosamente`

### 3. Probar Endpoint de Test

Deberías ver:
```json
{
  "success": true,
    "configured": true,
    "pixelId": "83726112...",
    "tokenConfigured": true
  },
  "email": {
    "configured": true,
    "provider": "Resend",
    "apiKeyConfigured": true
  }
}
```

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**

1. El archivo `.env.vercel` contiene secretos sensibles
2. **NO subir a Git** (ya está en .gitignore)
3. **NO compartir públicamente**
4. Renovar tokens si se comprometen:
   - Meta Access Token: https://developers.facebook.com/tools/accesstoken/
   - Resend API Key: https://resend.com/api-keys
   - ePayco Keys: https://dashboard.epayco.co

---

## 📞 Contacto y Soporte

Si tienes problemas con las variables de entorno:

1. **Vercel Logs**: Revisa los logs de las funciones serverless
2. **Browser Console**: Abre F12 y busca errores
3. **Supabase Logs**: Revisa logs en Supabase Dashboard
4. **Meta Events Manager**: Verifica eventos en Facebook Business

---

## 📝 Notas Adicionales

### Diferencia entre Variables con y sin VITE_

- **Sin prefijo** (`RESEND_API_KEY`): Usadas por funciones serverless en `/api/`

### Ambientes en Vercel

- **Production**: Variables para tu dominio principal en producción
- **Preview**: Variables para deployments de preview (branches)
- **Development**: Variables para desarrollo local con Vercel CLI

**Recomendación:** Configurar las mismas variables para los 3 ambientes.

---

## ✅ Checklist de Configuración

- [ ] Importar `.env.vercel` en Vercel Dashboard
- [ ] Seleccionar 3 ambientes: Production, Preview, Development
- [ ] Verificar que se importaron todas las 19 variables
- [ ] Hacer un nuevo deployment
- [ ] Crear un pedido de prueba
- [ ] Verificar que llegue email de confirmación
- [ ] Verificar eventos en Meta Events Manager
- [ ] Revisar logs de Vercel para errores

---

**Fecha de creación:** 2025-11-13
**Proyecto:** SoyEsbelta12
**Repositorio:** https://github.com/soyesbelta-pixel/SoyEsbelta12
