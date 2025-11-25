# Arquitectura Completa del Proyecto Esbelta

## Resumen Ejecutivo

**Proyecto:** Silueta Dorada (Esbelta)
**Tipo:** E-commerce de shapewear colombiano
**Framework:** React 19 + Vite 7
**Estado Management:** Zustand 5 con persistencia
**Despliegue:** Vercel con Serverless Functions
**Base de Datos:** Supabase (opcional, con fallback a datos estáticos)

## 1. Arquitectura General

### 1.1 Stack Tecnológico

```yaml
Frontend:
  - React: 19.1.1
  - Vite: 7.1.2
  - React Router DOM: 7.8.1
  - Framer Motion: 12.23.12 (animaciones)
  - TailwindCSS: 3.4.1 (estilos)
  - Lucide React: 0.540.0 (iconos)

State Management:
  - Zustand: 5.0.7
  - Immer: 10.1.1 (inmutabilidad)
  - zustand/middleware: persist en localStorage

Backend/APIs:
  - Vercel Serverless Functions (/api)
  - Supabase: 2.58.0 (base de datos opcional)
  - OpenRouter API (chat AI)
  - Google Gemini API (probador virtual)

Utilidades:
  - Axios: 1.7.7 (HTTP requests)
  - Canvas Confetti: 1.9.3 (celebraciones)
  - XLSX: 0.18.5 (exportación Excel)
```

### 1.2 Estructura de Directorios

```
acabadoo/
├── api/                          # Vercel Serverless Functions
│   ├── chat/
│   │   ├── message.js           # Endpoint chat AI
│   │   └── reset.js             # Reset conversación
│   └── virtual-tryon/
│       └── generate.js          # Generación imagen probador virtual
│
├── public/                       # Assets estáticos
│   ├── icon-*.png               # PWA icons
│   ├── videos/                  # Videos de productos
│   └── [product-images]/        # Imágenes por producto/color
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── admin/              # Panel administración
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── EmailTable.jsx
│   │   │   ├── ProductManager.jsx
│   │   │   ├── ProductEditor.jsx
│   │   │   ├── VirtualTryOnManager.jsx
│   │   │   └── VirtualTryOnLeads.jsx
│   │   │
│   │   ├── VirtualTryOn/       # Sistema probador virtual
│   │   │   ├── VirtualTryOnApp.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ProductSelector.jsx
│   │   │   ├── GeneratedImage.jsx
│   │   │   ├── ContactCaptureModal.jsx
│   │   │   ├── LimitReachedModal.jsx
│   │   │   ├── ThankYouModal.jsx
│   │   │   └── services/
│   │   │       └── geminiService.js
│   │   │
│   │   ├── Header.jsx          # Navegación principal
│   │   ├── Hero.jsx            # Sección hero
│   │   ├── ProductCatalog.jsx  # Catálogo con filtros
│   │   ├── ProductCard.jsx     # Card individual
│   │   ├── ProductDetailModal.jsx
│   │   ├── Cart.jsx            # Carrito lateral
│   │   ├── SizeAdvisor.jsx     # Asesor de tallas
│   │   ├── ChatBot.jsx         # Chat AI Sofia
│   │   ├── HelpCenter.jsx      # Centro ayuda
│   │   ├── EmailPopup.jsx      # Captura emails
│   │   ├── Benefits.jsx        # Sección beneficios
│   │   ├── Testimonials.jsx    # Testimonios
│   │   └── VideoStorySection.jsx
│   │
│   ├── data/
│   │   └── products.js         # Datos productos estáticos
│   │
│   ├── pages/
│   │   ├── AdminLogin.jsx      # Login administrador
│   │   └── AdminDashboard.jsx  # Dashboard admin
│   │
│   ├── services/               # Servicios externos
│   │   ├── OpenRouterService.js    # Chat AI
│   │   ├── ProductService.js       # CRUD productos
│   │   ├── VirtualTryOnService.js  # Gestión probador
│   │   ├── ImageService.js         # Optimización imágenes
│   │   ├── supabaseClient.js       # Cliente Supabase
│   │   └── supabaseAdmin.js        # Admin Supabase
│   │
│   ├── store/
│   │   └── useStore.js         # Zustand store global
│   │
│   ├── utils/
│   │   ├── exportToExcel.js    # Exportación datos
│   │   └── formValidation.js   # Validación forms
│   │
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globales
│
├── services/                    # Backend services (Node.js)
│   ├── openRouterService.js    # Backend OpenRouter
│   └── geminiService.js        # Backend Gemini
│
├── scripts/
│   └── generate-icons.js       # Generación iconos PWA
│
├── tailwind.config.js          # Config TailwindCSS
├── vite.config.js              # Config Vite + PWA
├── vercel.json                 # Config Vercel deployment
└── package.json                # Dependencias
```

## 2. Flujo de Datos

### 2.1 Estado Global (Zustand)

**Ubicación:** `src/store/useStore.js`
**Persistencia:** localStorage con key `silueta-dorada-storage`

```javascript
Estado Persistido:
├── cart                    // Array de items del carrito
├── favorites              // Array de IDs favoritos
├── user                   // Objeto usuario autenticado
├── capturedEmails         // Array emails capturados
├── chatMessages           // Historial chat
├── chatIsOpen             // Estado chat abierto
└── openProductId          // ID producto modal abierto

Estado No Persistido:
├── notifications          // Notificaciones temporales (auto-remove 5s)
├── chatIsTyping          // Indicador typing chat
├── showVirtualTryOn      // Estado modal probador virtual
├── productModalOpen      // Estado modal producto
└── selectedCategory      // Categoría seleccionada catálogo
```

**Métodos Críticos:**

```javascript
// Carrito
addToCart(product)           // Dispara evento 'cartSuccess'
removeFromCart(productId, size)
updateQuantity(productId, size, quantity)
clearCart()
getCartTotal()
getCartCount()

// Favoritos
toggleFavorite(productId)

// Usuario
setUser(user)

// Notificaciones
addNotification(notification)  // Auto-remove después de 5s

// Chat
addChatMessage(message)
clearChatMessages()
getChatContext()              // Retorna contexto para AI

// Probador Virtual
setShowVirtualTryOn(show)

// Productos
setProductModalOpen(isOpen)
setSelectedCategory(category)
setOpenProductId(id)

// Emails
addCapturedEmail(email)
```

### 2.2 Flujo de Productos

```
┌─────────────────────────────────────────────────────────────┐
│                      ProductService                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├── Feature Flag: USE_SUPABASE
                            │
            ┌───────────────┴────────────────┐
            │                                │
            v                                v
    [Supabase Enabled]              [Fallback Mode]
            │                                │
            v                                v
    ┌──────────────┐                ┌──────────────┐
    │   Supabase   │                │   products   │
    │   Database   │                │    .js       │
    └──────────────┘                └──────────────┘
            │                                │
            └────────────┬───────────────────┘
                         v
                  ┌─────────────┐
                  │    Cache    │
                  │   5 min TTL │
                  └─────────────┘
                         │
                         v
                  ProductCatalog.jsx
                         │
                         v
                  ProductCard.jsx
```

**Características:**
- Cache de 5 minutos para optimizar requests
- Feature flag `VITE_USE_SUPABASE` para habilitar/deshabilitar Supabase
- Fallback automático a datos estáticos si Supabase falla
- Transformación de datos entre formato Supabase y estático

### 2.3 Flujo de Chat AI (Sofia)

```
┌─────────────────────────────────────────────────────────────┐
│                        ChatBot.jsx                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │  OpenRouterService.js  │
              │  (Frontend)            │
              └────────────────────────┘
                            │
                            ├── Verifica Cache Local
                            │   (saludos, despedidas)
                            │
                            v
              ┌────────────────────────┐
              │  /api/chat/message     │
              │  (Vercel Function)     │
              └────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │  openRouterService.js  │
              │  (Backend)             │
              └────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │    OpenRouter API      │
              │  (google/gemini-pro)   │
              └────────────────────────┘
```

**Características:**
- Cache de respuestas frecuentes (saludos, preguntas comunes)
- Sesión persistente con `sessionId`
- Historial limitado a 20 mensajes
- Contexto de productos incluido en cada request
- Detección automática de entorno (dev/prod)

### 2.4 Flujo de Probador Virtual

```
┌─────────────────────────────────────────────────────────────┐
│                   VirtualTryOnApp.jsx                        │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
                v                        v
        [Usuario sube foto]      [Selecciona producto]
                │                        │
                └───────────┬────────────┘
                            v
              ┌────────────────────────┐
              │  geminiService.js      │
              │  (Frontend)            │
              └────────────────────────┘
                            │
                            ├── Convierte a Base64
                            │
                            v
              ┌────────────────────────┐
              │ /api/virtual-tryon/    │
              │       generate         │
              │  (Vercel Function)     │
              └────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │  geminiService.js      │
              │  (Backend)             │
              └────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │   Google Gemini API    │
              │  (Image Generation)    │
              └────────────────────────┘
                            │
                            v
              ┌────────────────────────┐
              │   Imagen generada      │
              │   (Base64 response)    │
              └────────────────────────┘
```

**Características:**
- Límite de intentos por usuario (gestión con Supabase)
- Captura de leads después del primer intento
- Conversión de imágenes a Base64 antes de envío
- Manejo de errores con fallback
- Modal de agradecimiento después de generación

## 3. Componentes Críticos

### 3.1 App.jsx - Componente Raíz

**Responsabilidades:**
- Router principal con rutas: `/`, `/admin`, `/admin/dashboard`
- Layout global con Header, Footer
- Gestión de modales principales: Cart, SizeAdvisor, HelpCenter, VirtualTryOn, ChatBot
- Sistema de notificaciones
- Limpieza de localStorage al cargar

**Dependencias Críticas:**
- Header (navegación)
- ProductCatalog (catálogo principal)
- Cart (carrito lateral)
- ChatBot (asistente IA)
- VirtualTryOnModal (probador virtual)
- EmailPopup (captura emails)

### 3.2 Header.jsx - Navegación

**Responsabilidades:**
- Navegación principal con scroll spy
- Top bar con características (envío gratis, garantía)
- Dropdown categorías con filtrado
- Contador de carrito en tiempo real
- Botón probador virtual
- Menú móvil responsive

**Estado Sincronizado:**
- `getCartCount()` desde Zustand
- `selectedCategory` para filtrado
- `productModalOpen` para ocultar en modales

### 3.3 ProductCatalog.jsx - Catálogo Principal

**Responsabilidades:**
- Carga de productos desde ProductService
- Filtrado por categoría, búsqueda, precio
- Ordenamiento (popular, precio, descuento, rating)
- Grid responsive de ProductCards
- Reload automático al hacer focus en ventana

**Características:**
- Integración con ProductService (Supabase + fallback)
- Cache clearing en cada carga
- Loading state durante fetch
- Filtros múltiples aplicados simultáneamente

### 3.4 Cart.jsx - Carrito de Compras

**Responsabilidades:**
- Lista de items del carrito
- Actualización de cantidades
- Cálculo de totales y descuentos
- Botón checkout → PaymentGateway
- Persistencia automática vía Zustand

**Eventos Especiales:**
- Trigger evento `cartSuccess` al agregar productos
- Celebración con confetti en App.jsx

### 3.5 ChatBot.jsx - Asistente IA Sofia

**Responsabilidades:**
- Interfaz de chat con mensajes usuario/bot
- Quick replies para acciones comunes
- Integración con OpenRouterService
- Teaser popup para invitar a usar el chat
- Historial de conversación persistido

**Características:**
- Mensaje de bienvenida contextual (hora del día)
- Typing indicator durante respuesta AI
- Scroll automático al final de mensajes
- Context de carrito y favoritos enviado a AI

### 3.6 VirtualTryOnApp.jsx - Probador Virtual

**Responsabilidades:**
- Upload de imagen de usuario
- Selección de producto del catálogo
- Generación de imagen try-on con Gemini
- Gestión de límite de intentos
- Captura de leads después del primer intento

**Flujo de Usuario:**
1. Usuario sube foto
2. Selecciona producto
3. Generación de imagen
4. Captura de contacto (después del 1er intento)
5. Modal de agradecimiento

## 4. Servicios e Integraciones

### 4.1 ProductService.js

**Propósito:** Abstracción de datos de productos con fallback

**Métodos Públicos:**
```javascript
getProducts(filters)           // Lista con filtros opcionales
getProduct(productId)         // Producto individual
createProduct(data, images)   // Crear (admin, Supabase only)
updateProduct(id, updates)    // Actualizar (admin, Supabase only)
deleteProduct(id)             // Soft delete (admin, Supabase only)
setSupabaseMode(enabled)      // Toggle Supabase on/off
clearCache()                  // Limpiar cache manualmente
```

**Feature Flags:**
- `VITE_USE_SUPABASE=true` para habilitar Supabase
- Default: fallback a datos estáticos

### 4.2 OpenRouterService.js (Frontend)

**Propósito:** Cliente para chat AI con cache local

**Métodos Públicos:**
```javascript
sendMessage(message, context)           // Enviar mensaje
getProductRecommendations(preferences)  // Recomendaciones
analyzeUserIntent(message)              // Análisis de intención
resetChat()                             // Reset conversación
```

**Cache Local:**
- Saludos y despedidas
- Preguntas frecuentes (precio, envío, WhatsApp)
- Info probador virtual

### 4.3 Supabase Client

**Propósito:** Cliente Supabase con funciones principales

**Funciones Disponibles:**
```javascript
// Email Subscriptions
subscribeEmail(email, metadata)
getEmailSubscriptions(page, limit)
searchEmails(searchTerm)
getEmailStats()

// Auth
signIn(email, password)
signOut()
getCurrentUser()
onAuthStateChange(callback)
```

**Variables de Entorno:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4.4 Vercel Serverless Functions

**Endpoints Disponibles:**

```
POST /api/chat/message
Body: {
  message: string,
  context: object,
  sessionId: string
}
Response: {
  success: boolean,
  response: string,
  timestamp: string
}

POST /api/chat/reset
Body: {
  sessionId: string
}

POST /api/virtual-tryon/generate
Body: {
  userImageBase64: string (data URL),
  productImageBase64: string (data URL),
  product: {
    name: string,
    description: string,
    prompt: string
  }
}
Response: {
  success: boolean,
  image: string (base64),
  text: string
}
```

**Variables de Entorno Requeridas:**
- `OPENROUTER_API_KEY` (para chat y probador virtual)

## 5. Configuración de Despliegue

### 5.1 Vercel Configuration (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**Configuración Serverless:**
- Memory: 1024 MB por función
- Max Duration: 30 segundos
- CORS habilitado para todas las rutas `/api/*`

### 5.2 PWA Configuration (vite.config.js)

```javascript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
  manifest: {
    name: 'Esbelta moldea, realza y transforma tu figura',
    short_name: 'Esbelta',
    theme_color: '#3B2F2F',
    background_color: '#F5EFE7',
    display: 'standalone'
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 2MB,
    globPatterns: ['**/*.{js,css,html,ico,svg,webmanifest,woff2,otf}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
        handler: 'CacheFirst',
        cacheName: 'images-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 days }
      }
    ]
  }
})
```

## 6. Paleta de Colores (TailwindCSS)

```javascript
colors: {
  esbelta: {
    chocolate: '#3B2F2F',        // Principal
    cream: '#F5EFE7',            // Fondos
    sand: '#C9B7A5',             // Neutral
    sage: '#7D9A86',             // Secundario
    terracotta: '#D27C5A',       // Acento
    // Variaciones
    'chocolate-light': '#4A3C3C',
    'chocolate-dark': '#2C2424',
    // ... más variaciones
  }
}
```

**Uso en Componentes:**
- `bg-esbelta-cream` para fondos
- `text-esbelta-chocolate` para texto principal
- `bg-esbelta-sage` para botones secundarios
- `text-esbelta-terracotta` para acentos

## 7. Puntos Críticos de Atención

### 7.1 Al Modificar Estado Global (useStore.js)

**IMPORTANTE:**
- Siempre usar `partialize` para definir qué persiste en localStorage
- NO persistir `notifications` (se limpian automáticamente)
- Eventos custom como `cartSuccess` deben mantenerse en `addToCart`
- El auto-remove de notificaciones está en timer de 5s

### 7.2 Al Modificar Productos

**Opciones:**

**Opción A - Datos Estáticos (actual):**
- Editar `src/data/products.js`
- Estructura debe mantenerse exacta
- Imágenes deben estar en `/public/`
- Reiniciar dev server para ver cambios

**Opción B - Supabase (opcional):**
- Configurar `VITE_USE_SUPABASE=true`
- Usar ProductService.createProduct() / updateProduct()
- Mantener estructura de imágenes por color
- Migraciones disponibles en `/scripts/`

### 7.3 Al Agregar Nuevos Componentes

**Checklist:**
- Si es pesado (>50KB): usar `lazy()` y `Suspense`
- Usar `AnimatePresence` de Framer Motion para transiciones
- Importar desde Zustand: `import useStore from '../store/useStore'`
- Colores: usar variables Tailwind `esbelta-*`
- Iconos: importar desde `lucide-react`

### 7.4 Al Modificar APIs (Serverless Functions)

**Importante:**
- Mantener validación de entrada en cada endpoint
- Usar instancia singleton para servicios (cache de Vercel)
- Variables de entorno deben estar en Vercel dashboard
- Headers CORS ya configurados en `vercel.json`
- Timeout máximo: 30 segundos

### 7.5 Al Actualizar Estilos

**Convenciones:**
- Mobile-first approach (diseño base es móvil)
- Breakpoints: `md:`, `lg:`, `xl:`
- Font family: Montserrat (ya cargada globalmente)
- Animaciones: usar `framer-motion` o Tailwind `animate-*`
- Scroll: usar `scrollbar-hide` utility para ocultar scrollbars

## 8. Comandos de Desarrollo

```bash
# Instalación
npm install

# Desarrollo (puerto 5173)
npm run dev

# Build para producción
npm run build

# Preview build local
npm run preview

# Linting
npm run lint

# Generar iconos PWA
node scripts/generate-icons.js

# Migraciones (Supabase)
npm run migrate:products
npm run migrate:virtual-tryon
```

## 9. Variables de Entorno

### Frontend (.env.local)
```bash
# Supabase (opcional)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Feature Flags
VITE_USE_SUPABASE=false
```

### Backend (Vercel Environment Variables)
```bash
# API Keys (obligatorio)
OPENROUTER_API_KEY=xxx
```

## 10. Estructura de Datos

### 10.1 Producto

```javascript
{
  id: number,
  name: string,
  category: 'lenceria' | 'realce' | 'fajas' | 'moldeadoras',
  price: number,
  originalPrice: number,
  discount: number,
  image: string,
  videoUrl: string | null,
  images: string[],
  imagesByColor: {
    [color: string]: string[]
  },
  description: string,
  features: string[],
  sizes: string[],
  colors: string[],
  stock: number,
  rating: number,
  reviews: number,
  hot: boolean,
  new: boolean
}
```

### 10.2 Item de Carrito

```javascript
{
  ...product,           // Todos los campos del producto
  quantity: number,     // Cantidad seleccionada
  size: string         // Talla seleccionada
}
```

### 10.3 Mensaje de Chat

```javascript
{
  id: number | string,
  type: 'user' | 'bot',
  content: string,
  timestamp: string (ISO)
}
```

## 11. Eventos Personalizados

```javascript
// Evento de éxito al agregar al carrito
window.dispatchEvent(new CustomEvent('cartSuccess'));

// Escuchar en App.jsx
window.addEventListener('cartSuccess', handleCartSuccess);
```

## 12. Optimizaciones Actuales

### Performance:
- Code splitting con `React.lazy()`
- Cache de productos (5 min TTL)
- PWA con service worker (auto-update)
- Imágenes optimizadas (max 2MB en cache)
- Lazy loading de componentes pesados

### UX:
- Animaciones smooth con Framer Motion
- Confetti celebration al agregar al carrito
- Loading states en fetch de productos
- Teaser de ChatBot después de 6s
- Quick replies en chat para acciones comunes

### SEO/PWA:
- Manifest con iconos multi-tamaño
- Service worker con runtime caching
- Meta tags en index.html
- Nombres descriptivos en manifest

## 13. Próximas Mejoras Sugeridas

### Alto Impacto:
1. Implementar sistema de autenticación completo
2. Integración con pasarela de pago real
3. Sistema de seguimiento de pedidos
4. Panel de administración completo en Supabase
5. Analytics y tracking de conversiones

### Medio Impacto:
1. Optimización de imágenes con Sharp en build
2. Lazy loading de imágenes de productos
3. Sistema de reviews y ratings de usuarios
4. Comparador de productos
5. Wishlist persistente en cuenta

### Bajo Impacto:
1. Dark mode
2. Internacionalización (i18n)
3. Más animaciones en transiciones
4. Compartir en redes sociales
5. Sistema de cupones/descuentos

---

**Última Actualización:** 2025-10-19
**Versión:** 1.0.0
**Mantenedor:** Claude Code Analysis
