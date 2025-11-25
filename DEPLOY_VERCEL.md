# 🚀 Guía de Deployment a Vercel

## ✅ Refactorización Completada

El proyecto ha sido refactorizado exitosamente para deployment en Vercel con las siguientes mejoras:

### 📁 Estructura del Proyecto

```
acabadoo/
├── api/                          (NUEVO - Vercel Serverless Functions)
│   ├── chat/
│   │   ├── message.js           → POST /api/chat/message
│   │   └── reset.js             → POST /api/chat/reset
│   └── virtual-tryon/
│       └── generate.js          → POST /api/virtual-tryon/generate
├── services/                     (NUEVO - Servicios backend compartidos)
│   ├── openRouterService.js
│   └── geminiService.js
├── src/                         (Frontend React)
├── server/                      (Mantener para desarrollo local)
├── vercel.json                  (NUEVO - Configuración Vercel)
├── .env.production             (NUEVO - Template de variables)
└── DEPLOY_VERCEL.md            (Este archivo)
```

### 🔧 Cambios Realizados

1. ✅ **Carpeta `/api`**: Funciones serverless para Vercel
2. ✅ **Carpeta `/services`**: Servicios backend (OpenRouter, Gemini)
3. ✅ **vercel.json**: Configuración de routing y funciones
4. ✅ **Servicios frontend**: Ahora usan rutas relativas en producción
5. ✅ **Build test**: Compilación exitosa verificada

---

## 📋 Pasos para Deployment

### 1. Preparar Repositorio Git

```bash
# Si no tienes Git inicializado:
git init
git add .
git commit -m "Refactorización para Vercel - Backend Serverless Functions"

# Subir a GitHub (crear repo primero en github.com):
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 2. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate o inicia sesión (con GitHub recomendado)
3. Click en **"Add New Project"**
4. Selecciona tu repositorio de GitHub
5. Click en **"Import"**

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, antes de hacer el primer deploy:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

#### Variables de Backend (API Keys - REQUERIDAS)

| Variable | Value | Environments |
|----------|-------|--------------|
| `OPENROUTER_API_KEY` | `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` | Production, Preview, Development |

#### Variables de Frontend (VITE_* - REQUERIDAS)

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://kynogljhbbvagneiydrk.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Tu key de Supabase (ver .env.local) | Production, Preview, Development |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Tu service role key | Production, Preview, Development |
| `VITE_USE_SUPABASE` | `true` | Production, Preview, Development |

#### Variables Opcionales

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_BACKEND_URL` | **NO configurar** (usará rutas relativas) | - |

**IMPORTANTE**: NO configures `VITE_BACKEND_URL` en Vercel. El frontend usará rutas relativas automáticamente.

### 4. Configuración del Proyecto

Vercel detectará automáticamente:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no lo detecta, configúralo manualmente en **Settings** → **General**.

### 5. Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. Una vez completado, recibirás la URL de tu app: `https://tu-proyecto.vercel.app`

---

## 🧪 Verificar Deployment

### 1. Frontend
Visita tu URL de Vercel: `https://tu-proyecto.vercel.app`

### 2. Chatbot (API)
```bash
curl -X POST https://tu-proyecto.vercel.app/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola","sessionId":"test"}'
```

Deberías recibir una respuesta de Sofia.

### 3. Probador Virtual (API)
El probador virtual funcionará automáticamente cuando subas una foto en la interfaz.

---

## 🔄 Desarrollo Local

Para desarrollo local, el setup es diferente:

### Opción 1: Servidor Express Local (Recomendado)

```bash
# Terminal 1: Backend Express
cd server
npm install
node index.js

# Terminal 2: Frontend Vite
npm run dev
```

El frontend usará `http://localhost:3001` (configurado en `.env.local`).

### Opción 2: Usar Vercel Dev (Simula producción)

```bash
npm install -g vercel
vercel dev
```

Esto simula el entorno de Vercel localmente con serverless functions.

---

## 📊 Estructura de APIs

### Chatbot

**Endpoint**: `POST /api/chat/message`

**Request**:
```json
{
  "message": "Hola, necesito una faja",
  "sessionId": "session_123",
  "context": {
    "products": [...],
    "currentPage": "catalog"
  }
}
```

**Response**:
```json
{
  "success": true,
  "response": "¡Hola! 👋 Soy Sofia...",
  "timestamp": "2025-10-13T17:00:00.000Z"
}
```

### Probador Virtual

**Endpoint**: `POST /api/virtual-tryon/generate`

**Request**:
```json
{
  "userImageBase64": "data:image/jpeg;base64,...",
  "productImageBase64": "data:image/jpeg;base64,...",
  "product": {
    "name": "Faja Invisible",
    "description": "...",
    "prompt": "..."
  }
}
```

**Response**:
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "text": "Se generó exitosamente..."
}
```

---

## 🐛 Troubleshooting

### Error: "OPENROUTER_API_KEY not configured"

**Solución**: Verifica que configuraste la variable en Vercel Settings → Environment Variables

### Error: "Function exceeded timeout"

**Solución**: Las funciones tienen límite de 30s. Esto está configurado en `vercel.json`. Si necesitas más tiempo, actualiza el plan de Vercel.

### Error: "Failed to fetch /api/chat/message"

**Solución**:
1. Verifica que el build se completó correctamente
2. Checa los logs en Vercel Dashboard → Deployments → [Tu deploy] → Functions
3. Asegúrate que las variables de entorno estén configuradas

### Frontend funciona pero API no

**Solución**:
1. Ve a Vercel Dashboard → Deployments
2. Click en el deployment actual
3. Ve a **Functions** tab
4. Revisa los logs de errores

---

## 📈 Monitoreo

### Ver Logs en Tiempo Real

1. Ve a Vercel Dashboard
2. Click en tu proyecto
3. Ve a **Deployments** → [Latest] → **Functions**
4. Selecciona la función (`api/chat/message.js`, etc.)
5. Ve los logs en tiempo real

### Analytics

Vercel incluye analytics gratis:
- **Pageviews**: Visitas a tu sitio
- **API Calls**: Llamadas a tus functions
- **Performance**: Web Vitals

---

## 🔐 Seguridad

### ✅ API Keys Protegidas

Las API keys de OpenRouter están:
- ❌ **NO expuestas** en el código frontend
- ✅ **Protegidas** en variables de entorno de Vercel
- ✅ **Accesibles solo** por las serverless functions
- ✅ **Nunca enviadas** al navegador del usuario

### CORS

CORS está configurado en `vercel.json` para permitir:
- Todas las origins (`*`) - Ajusta según necesites
- Métodos: GET, POST, PUT, DELETE, etc.

---

## 💰 Costos

### Plan Gratuito de Vercel incluye:

- ✅ 100 GB bandwidth
- ✅ 100 GB-hrs serverless function execution
- ✅ Deployments ilimitados
- ✅ Preview deployments para PRs
- ✅ SSL automático
- ✅ CDN global

**Esto es más que suficiente para tu proyecto** 🎉

---

## 🎉 Próximos Pasos

1. ✅ Deploy completado
2. Prueba todas las funcionalidades en producción
3. Configura dominio personalizado (opcional):
   - Vercel Settings → Domains
   - Agrega tu dominio: `www.esbelta.com`
4. Configura preview URLs para testing:
   - Cada PR tendrá su propia URL automática
5. Monitorea performance en Analytics

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Comprueba que el build local funciona: `npm run build`
4. Revisa la documentación de Vercel: [vercel.com/docs](https://vercel.com/docs)

---

**¡Listo para producción!** 🚀
