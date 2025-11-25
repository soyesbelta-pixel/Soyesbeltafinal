# Arquitectura del ChatBot - Sofia AI Assistant

**Fecha de análisis:** 2025-10-19
**Estado:** Documentado para mejoras

---

## 📊 RESUMEN EJECUTIVO

El chatbot "Sofia" es un asistente de ventas AI que ayuda a los clientes a elegir fajas colombianas. Usa OpenRouter API con Gemini 2.5 Flash como modelo de lenguaje y está integrado en toda la aplicación.

### Características Principales
- ✅ Asistente conversacional con personalidad colombiana
- ✅ Recomendaciones personalizadas de productos
- ✅ Caché local de respuestas frecuentes (respuestas instantáneas)
- ✅ Historial de conversación con contexto
- ✅ Quick replies para preguntas comunes
- ✅ Integración con carrito de compras
- ✅ Teaser popup para invitar a usar el chat
- ✅ Backend en Vercel Serverless Functions

---

## 🏗️ ARQUITECTURA

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ChatBot.jsx (450 líneas)                            │  │
│  │ - UI conversacional                                  │  │
│  │ - Gestión de mensajes                               │  │
│  │ - Quick replies                                      │  │
│  │ - Product cards en mensajes                         │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ OpenRouterService.js (Frontend - 216 líneas)        │  │
│  │ - Caché de respuestas                               │  │
│  │ - Gestión de sesión (sessionId)                     │  │
│  │ - Llamadas a backend                                │  │
│  │ - Historial local                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Vercel Serverless)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ /api/chat/message.js                                │  │
│  │ - Endpoint POST para mensajes                       │  │
│  │ - Validación de input                               │  │
│  │ - Instancia compartida de servicio                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ /api/chat/reset.js                                  │  │
│  │ - Endpoint POST para resetear chat                  │  │
│  │ - Limpia historial de sesión                        │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ services/openRouterService.js (Backend - 182 líneas)│  │
│  │ - Cliente OpenAI con baseURL OpenRouter             │  │
│  │ - System prompt para Sofia                          │  │
│  │ - Caché de respuestas                               │  │
│  │ - Historial por sesión (Map)                        │  │
│  │ - Integración con Gemini 2.5 Flash                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 OPENROUTER API                              │
│         (Gemini 2.5 Flash Preview 09-2025)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 ARCHIVOS CLAVE

### Frontend

#### 1. `src/components/ChatBot.jsx` (450 líneas)
**Propósito:** Componente principal del chatbot con UI completa

**Características:**
- Botón flotante con animación spring (Framer Motion)
- Ventana de chat modal (360px width, 520px height)
- Sistema de mensajes con scroll automático
- Quick replies con 4 opciones predefinidas
- Product cards embebidas en respuestas
- Teaser popup después de 6 segundos
- Estados: isOpen, messages, inputMessage, isTyping, showQuickReplies

**Quick Replies:**
```javascript
[
  { id: 1, label: "Fajas moldeadoras", icon: "✨", action: "modeladora" },
  { id: 2, label: "Fajas para uso diario", icon: "☀️", action: "diario" },
  { id: 3, label: "Necesito ayuda con tallas", icon: "📏", action: "tallas" },
  { id: 4, label: "Ver ofertas especiales", icon: "🎁", action: "ofertas" }
]
```

**Colores usados:**
- Botón flotante: `from-orange-500 via-orange-400 to-green-500` (NECESITA ACTUALIZACIÓN A NUEVA PALETA)
- Header chat: `from-esbelta-terracotta to-esbelta-terracotta-dark`
- Mensajes usuario: `from-esbelta-terracotta to-esbelta-terracotta-dark`
- Mensajes bot: `bg-white shadow-md border border-esbelta-sand/20`

#### 2. `src/services/OpenRouterService.js` (216 líneas)
**Propósito:** Servicio frontend para comunicación con backend

**Responsabilidades:**
- Generar sessionId único: `session_${Date.now()}_${Math.random()}`
- Caché local de respuestas frecuentes (11 respuestas)
- Llamadas HTTP al backend (`/api/chat/message`, `/api/chat/reset`)
- Mantener historial local (máximo 20 mensajes)
- Enriquecer contexto con información de productos

**Caché de respuestas:**
```javascript
'hola' → "¡Hola! 👋 Soy Sofia..."
'buenos dias' → "¡Buenos días! 🌞..."
'precio' → "Nuestros precios van desde..."
'envio' → "Hacemos envíos a todo el país..."
'probador virtual' → "🌟 ¡Nuestro Probador Virtual es único!..."
```

**Detección de entorno:**
```javascript
const BACKEND_URL = import.meta.env.MODE === 'production'
  ? ''  // Rutas relativas /api/* en Vercel
  : 'http://localhost:3001';  // Servidor Express en desarrollo
```

### Backend (Vercel Serverless Functions)

#### 3. `api/chat/message.js` (60 líneas)
**Propósito:** Endpoint para procesar mensajes del chat

**Request:**
```json
POST /api/chat/message
{
  "message": "Necesito una faja para uso diario",
  "context": {
    "currentPage": "/",
    "cartItems": [...],
    "products": [...]
  },
  "sessionId": "session_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "response": "¡Perfecto! Para uso diario te recomiendo...",
  "timestamp": "2025-10-19T12:00:00.000Z"
}
```

**Validaciones:**
- Solo método POST
- message debe ser string
- sessionId opcional (default: 'default')

#### 4. `api/chat/reset.js` (48 líneas)
**Propósito:** Resetear conversación

**Request:**
```json
POST /api/chat/reset
{
  "sessionId": "session_1234567890_abc123"
}
```

#### 5. `services/openRouterService.js` (182 líneas)
**Propósito:** Servicio backend con lógica de AI

**Características clave:**
- Cliente OpenAI con baseURL de OpenRouter
- System prompt completo para Sofia
- Historial por sesión (Map: sessionId → messages[])
- Caché de respuestas (11 respuestas predefinidas)
- Límite de historial: 20 mensajes (10 interacciones)

**Configuración OpenRouter:**
```javascript
{
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://esbelta.com',
    'X-Title': 'Esbelta - Fajas Colombianas Premium'
  }
}
```

**Parámetros del modelo:**
```javascript
{
  model: 'google/gemini-2.5-flash-preview-09-2025',
  temperature: 0.7,
  max_tokens: 300,
  top_p: 0.9,
  frequency_penalty: 0.5,
  presence_penalty: 0.3
}
```

---

## 🧠 SYSTEM PROMPT (Backend)

```
Eres Sofia, asesora de Esbelta - Fajas Colombianas Premium. Personalidad cálida, profesional y colombiana.

TIENDA: Esbelta | WhatsApp: +52 55 5961 1567 | Envíos nacionales

PRODUCTOS: [Lista dinámica con nombre, precio, descuento, tallas, colores, categoría]

🌟 PROBADOR VIRTUAL (DIFERENCIAL ÚNICO): Tecnología IA para probarse fajas virtualmente antes de comprar. Ubicación: Menú principal → "Probador Virtual"

REGLAS:
1. Tono amigable colombiano, emojis moderados 💖
2. Recomienda productos según necesidades
3. Menciona descuentos actuales
4. Respuestas concisas (máx 100 palabras)
5. Usa negritas **importantes**
6. Sugiere WhatsApp para detalles específicos
7. Si no hay info → contactar WhatsApp
8. 🎯 IMPORTANTE: Menciona el **Probador Virtual** como nuestro diferencial único e invita a usarlo desde el menú

Responde directo, sin preámbulos.
```

---

## 🔄 FLUJO DE DATOS

### Flujo Normal de Mensaje

```
1. Usuario escribe mensaje en ChatBot.jsx
   ↓
2. handleSendMessage() agrega mensaje al estado local
   ↓
3. OpenRouterService.sendMessage(message, context)
   ↓
4. Verifica caché local (respuestas instantáneas)
   ├─ Si hay caché → retorna inmediatamente
   └─ Si no hay caché:
       ↓
5. Enriquece contexto con productos del catálogo
   ↓
6. POST a /api/chat/message con message, context, sessionId
   ↓
7. Backend: getOpenRouterService() obtiene instancia compartida
   ↓
8. services/openRouterService.js verifica caché backend
   ├─ Si hay caché → retorna
   └─ Si no hay caché:
       ↓
9. Construye array de mensajes con system prompt + historial
   ↓
10. Enriquece último mensaje con contexto (página, carrito)
    ↓
11. OpenRouter API call con Gemini 2.5 Flash
    ↓
12. Respuesta de Gemini
    ↓
13. Guarda en historial de sesión (Map)
    ↓
14. Retorna respuesta a frontend
    ↓
15. ChatBot.jsx detecta menciones de productos
    ↓
16. Renderiza mensaje con product cards si aplica
```

### Flujo de Quick Reply

```
1. Usuario hace click en quick reply
   ↓
2. handleQuickReply(reply)
   ↓
3. Lógica especial para "tallas" y "ofertas" (respuestas hardcoded)
   ↓
4. Para otros: Envía mensaje a OpenRouter con query específica
   ↓
5. Sigue flujo normal de mensaje
```

### Flujo de Reset

```
1. (Actualmente NO se llama desde ChatBot.jsx)
   ↓
2. OpenRouterService.resetChat()
   ↓
3. POST a /api/chat/reset
   ↓
4. Backend limpia historial de sesión
   ↓
5. Frontend limpia historial local y genera nuevo sessionId
```

---

## 🎨 UI/UX ACTUAL

### Botón Flotante
- Posición: `fixed bottom-6 right-6`
- Tamaño: 56x56px
- Gradiente: `from-orange-500 via-orange-400 to-green-500` ⚠️ **DESACTUALIZADO**
- Animación: Spring con delay 0.4s
- Texto: "Te ayudo?" en 7px
- Hover: scale 1.05
- Tap: scale 0.9

### Teaser Popup
- Aparece: 6 segundos después de cargar página
- Desaparece: 20 segundos o al abrir chat
- Posición: `fixed bottom-24 right-6`
- Avatar: 👩‍💼
- Gradiente botón: `from-esbelta-terracotta to-esbelta-terracotta-dark` ✅
- Max width: 280px

### Ventana de Chat
- Tamaño: 360px × 520px
- Posición: `fixed bottom-24 right-6`
- Border radius: 24px (rounded-3xl)
- Header: Gradiente terracotta con avatar Sofia
- Indicador: "En línea ahora" con punto verde animado
- Fondo mensajes: Blanco
- Scroll automático al final

### Mensajes
- Usuario: Gradiente terracotta, texto blanco, esquina inferior derecha redondeada
- Bot: Fondo blanco, borde sand/20, esquina inferior izquierda redondeada
- Máximo width: 80%
- Timestamp en gris pequeño

### Product Cards en Mensajes
- Fondo blanco con sombra
- Imagen 16x16 (64px)
- Precio con tachado + precio actual + badge descuento
- Botón "Agregar al carrito"

### Quick Replies
- 4 botones en grid 2x2 (mobile) o 1 línea (desktop)
- Borde sand con hover terracotta
- Iconos a la derecha
- Se pueden cerrar con X

---

## 📦 INTEGRACIÓN CON ZUSTAND STORE

**Nota:** El chatbot actualmente NO usa el store de Zustand para mensajes, los maneja localmente.

### Estado disponible (no usado):
```javascript
// src/store/useStore.js
chatMessages: [],
addChatMessage: (message) => {
  set({
    chatMessages: [...get().chatMessages, {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }]
  });
},
clearChatMessages: () => set({ chatMessages: [] }),
```

### Integraciones activas:
- `cart` - Para enviar contexto del carrito al AI
- `addToCart` - Para agregar productos desde product cards
- `addNotification` - Para notificar cuando se agrega al carrito

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

**Frontend (.env.local):**
```env
VITE_BACKEND_URL=http://localhost:3001  # Solo desarrollo
# En producción: no se configura (usa rutas relativas)
```

**Backend (process.env):**
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

### Detección de Entorno
```javascript
// Frontend
const BACKEND_URL = import.meta.env.MODE === 'production'
  ? ''  // /api/* en Vercel
  : 'http://localhost:3001';

// Backend - siempre usa process.env.OPENROUTER_API_KEY
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. Colores Desactualizados
**Ubicación:** ChatBot.jsx línea 194
**Problema:** Botón flotante usa `from-orange-500 via-orange-400 to-green-500`
**Debe ser:** `from-esbelta-sand via-esbelta-terracotta to-esbelta-chocolate`

### 2. Historial Duplicado
**Problema:** Historial se mantiene en 3 lugares:
- Frontend: `conversationHistory` en OpenRouterService.js frontend
- Backend: `conversationHistory` Map en services/openRouterService.js
- No usado: `chatMessages` en Zustand store

**Consecuencia:** Posible desincronización entre frontend y backend

### 3. Persistencia de Sesión
**Problema:** sessionId se genera en cada recarga de página
**Consecuencia:** Se pierde el historial de conversación al recargar

### 4. No hay Reset Visible
**Problema:** La función `resetChat()` existe pero no hay botón UI para llamarla
**Consecuencia:** Usuario no puede limpiar conversación fácilmente

### 5. Product Cards Limitadas
**Problema:** Solo muestra máximo 2 productos por mensaje (línea 149)
**Código:** `products: productMentions.slice(0, 2)`

### 6. Caché Duplicado
**Problema:** Caché de respuestas existe en frontend Y backend con los mismos valores
**Consecuencia:** Duplicación de código, mantenimiento doble

### 7. Max Tokens Limitado
**Problema:** `max_tokens: 300` puede ser insuficiente para respuestas detalladas
**Ubicación:** services/openRouterService.js línea 130

### 8. Sin Manejo de Rate Limits
**Problema:** Solo maneja error 429 con mensaje genérico
**Mejora:** Podría implementar retry automático con backoff

### 9. Sin Analytics
**Problema:** No se registran métricas de uso del chatbot
**Faltan:** Mensajes por sesión, intenciones detectadas, productos recomendados, conversiones

### 10. Formato de Mensajes Simple
**Problema:** Solo soporta **negrita** con markdown básico
**Faltan:** Listas, enlaces, imágenes, botones de acción

---

## 💡 OPORTUNIDADES DE MEJORA

### Mejoras de UX
1. **Botón "Nuevo chat"** visible en header
2. **Persistir sessionId** en localStorage
3. **Indicador de escritura** más elaborado (nombre + "está escribiendo...")
4. **Sugerencias dinámicas** basadas en contexto de la conversación
5. **Historial de conversaciones** guardadas
6. **Modo compacto** para mobile (más pequeño)
7. **Notificaciones** cuando Sofia responde si el chat está cerrado

### Mejoras Técnicas
1. **Consolidar caché** (solo en backend)
2. **WebSocket** para respuestas en tiempo real (streaming)
3. **Retry automático** con exponential backoff
4. **Métricas y analytics** con Supabase
5. **Rate limiting** en frontend para evitar spam
6. **Validación de inputs** más robusta
7. **Error boundaries** para errores de React
8. **Tests unitarios** para lógica crítica

### Mejoras de AI
1. **Aumentar max_tokens** a 500-800 para respuestas más completas
2. **Function calling** para acciones directas (agregar al carrito, abrir producto)
3. **Embedding search** para encontrar productos similares
4. **Sentiment analysis** para detectar frustración
5. **Intent classification** más precisa
6. **Multi-turn conversations** con mejor contexto
7. **A/B testing** de prompts diferentes

### Mejoras de Personalización
1. **Recordar preferencias** del usuario (talla, presupuesto)
2. **Recomendaciones basadas en historial** de navegación
3. **Seguimiento post-compra** ("¿Cómo te quedó la faja?")
4. **Ofertas personalizadas** según conversación

---

## 🧪 TESTING RECOMENDADO

### Test Manual
- [ ] Respuestas cacheadas son instantáneas
- [ ] Quick replies funcionan correctamente
- [ ] Product cards se muestran cuando se mencionan productos
- [ ] Scroll automático funciona
- [ ] Teaser aparece y desaparece correctamente
- [ ] Botón flotante se anima correctamente
- [ ] Agregar al carrito desde product card funciona
- [ ] Historial se mantiene durante la sesión
- [ ] Manejo de errores muestra mensajes adecuados

### Test de Integración
- [ ] Backend responde correctamente en desarrollo
- [ ] Backend responde correctamente en producción (Vercel)
- [ ] Detección de entorno funciona (dev vs prod)
- [ ] Sesión se mantiene entre múltiples mensajes
- [ ] Contexto (carrito, página) se envía correctamente

### Test de AI
- [ ] Respuestas son coherentes y en español colombiano
- [ ] Menciona productos del catálogo
- [ ] Sugiere WhatsApp cuando no tiene información
- [ ] Menciona Probador Virtual como diferencial
- [ ] Respuestas son concisas (< 100 palabras)
- [ ] Usa emojis moderadamente

---

## 📊 MÉTRICAS ACTUALES (NO IMPLEMENTADAS)

### Métricas que deberían registrarse:
- Número de conversaciones iniciadas
- Mensajes por conversación (promedio)
- Tasa de uso de quick replies
- Productos más mencionados
- Conversiones desde el chatbot
- Tiempo de respuesta promedio
- Tasa de error
- Intenciones más comunes

---

## 🔗 DEPENDENCIAS

### NPM Packages
- `openai` (^4.x) - Cliente para OpenRouter API
- `framer-motion` (^12.x) - Animaciones
- `lucide-react` - Iconos (MessageCircle, X, Send, Sparkles, Loader2)
- `zustand` - State management (para cart y notificaciones)

### APIs Externas
- **OpenRouter API** - https://openrouter.ai/api/v1
- **Gemini 2.5 Flash** (vía OpenRouter) - Modelo de lenguaje

---

## 📝 PRÓXIMOS PASOS SUGERIDOS

### Prioridad Alta
1. Actualizar colores del botón flotante a nueva paleta
2. Implementar botón "Nuevo chat" visible
3. Persistir sessionId en localStorage
4. Consolidar caché (eliminar duplicación)

### Prioridad Media
5. Aumentar max_tokens a 500
6. Agregar analytics básicas
7. Implementar retry con backoff
8. Mejorar manejo de errores

### Prioridad Baja
9. Implementar WebSocket para streaming
10. Function calling para acciones directas
11. Historial de conversaciones guardadas
12. A/B testing de prompts

---

**Documento creado por:** Claude Code
**Última actualización:** 2025-10-19
