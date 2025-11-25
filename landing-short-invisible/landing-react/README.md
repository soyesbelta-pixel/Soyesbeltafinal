# 🌟 Landing Page Esbelta - Short Magic Invisible

Landing page premium para la marca colombiana de fajas **Esbelta**, especializada en el producto **Short Magic Invisible** con tecnología de realce natural.

## ✨ Características Principales

### 🎙️ Asistente de Voz con IA
- **Diseño Siri-Style**: Orbe flotante con animaciones glassmorphism
- **Integración Gemini AI**: Asistente virtual inteligente "Sofía"
- **Tooltip interactivo**: Mensaje "Conversa conmigo directamente 💬"
- **Animaciones premium**: Pulsaciones, breathe effect, anillos expansivos

### 📸 Virtual Try-On con IA
- **Generación de imágenes**: Vista frontal y lateral con Gemini AI
- **Drag & Drop**: Subida de fotos intuitiva
- **2 Productos**: Short Magic Beige y Short Magic Negro
- **Fotorealismo**: Marca de agua "Esbelta" en fondo profesional
- **Conversión directa**: Botón WhatsApp integrado en resultados

### 🎨 Diseño & UX
- **Responsive**: Mobile-first design con Tailwind CSS
- **Animaciones premium**: Framer Motion + CSS animations
- **Color palette**: Chocolate, Cream, Sand, Sage, Terracotta
- **Tipografía**: Montserrat
- **Countdown timer**: Urgencia con cuenta regresiva
- **Testimonios**: Carrusel de clientes reales
- **FAQ**: Preguntas frecuentes interactivas

## 🚀 Tecnologías

- **React 19** - Framework frontend
- **Vite 7** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first styling
- **Gemini AI** - Generación de imágenes y chat
- **@google/genai** - SDK oficial de Gemini
- **Lucide React** - Iconos modernos
- **Framer Motion** - Animaciones fluidas

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/soyesbelta-pixel/lanfing-2-.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔑 Configuración

### API Key de Gemini
La API key está configurada en `src/App.jsx`:

```javascript
const GEMINI_API_KEY = 'TU_API_KEY_AQUI';
```

**Importante**: En producción, mover la API key a variables de entorno.

## 📁 Estructura del Proyecto

```
landing-react/
├── public/
│   └── images/                # Imágenes estáticas
│       ├── logo-esbelta.png
│       ├── short-negro-1.png
│       └── clientes/
├── src/
│   ├── components/
│   │   ├── VoiceAssistant.jsx    # Asistente de voz
│   │   ├── VirtualTryOn.jsx      # Probador virtual
│   │   └── Transcript.jsx        # Transcripción de audio
│   ├── services/
│   │   └── geminiImageService.js # Servicio de generación IA
│   ├── utils/
│   │   └── audio.js              # Utilidades de audio
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Estilos globales
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Funcionalidades Destacadas

### Landing Page
- **Hero Section**: CTA principal con botón Virtual Try-On
- **Countdown**: Temporizador de oferta limitada
- **Productos**: Showcase del Short Magic en ambos colores
- **Kit Completo**: Exfoliante + Short + Aceite de Fenogreco
- **Testimonios**: Carrusel de clientes satisfechas
- **Garantía**: 30 días de devolución
- **FAQ**: Preguntas frecuentes desplegables
- **Calculadora de Talla**: Sistema interactivo
- **WhatsApp**: Integración para soporte y ventas

### Asistente de Voz
- Reconocimiento de voz en español
- Respuestas contextuales sobre productos
- Información de tallas, precios, envíos
- Diseño visual tipo Siri de iPhone

### Virtual Try-On
1. **Upload**: Usuario sube foto de cuerpo completo
2. **Select**: Elige producto (Beige o Negro)
3. **Generating**: IA procesa y genera imágenes
4. **Result**: Muestra vista frontal + lateral

## 🌐 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### Configuración de Variables de Entorno
```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Chocolate | `#3B2F2F` | Textos principales, botones |
| Cream | `#F5EFE7` | Fondos, secciones claras |
| Sand | `#C9B7A5` | Detalles neutrales |
| Sage | `#7D9A86` | Acentos secundarios |
| Terracotta | `#D27C5A` | CTAs, elementos destacados |

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Seguridad

- ⚠️ **API Keys**: No exponer en producción
- ✅ **HTTPS**: Usar en deploy final
- ✅ **CORS**: Configurar correctamente para APIs
- ✅ **Input Validation**: Validación de imágenes subidas

## 📝 TODO Producción

- [ ] Mover API keys a variables de entorno
- [ ] Configurar Google Analytics
- [ ] Implementar Facebook Pixel
- [ ] Optimizar imágenes (WebP)
- [ ] Configurar CDN para assets
- [ ] Setup de dominio personalizado
- [ ] SSL Certificate
- [ ] Meta tags para SEO
- [ ] Open Graph para compartir
- [ ] Sitemap.xml

## 🤝 Contribuciones

Proyecto desarrollado por el equipo de Esbelta con asistencia de IA.

## 📄 Licencia

Todos los derechos reservados © 2025 Esbelta

---

**Desarrollado con ❤️ para Esbelta - Fajas Colombianas Premium**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
# SoyesbeltaLanding
