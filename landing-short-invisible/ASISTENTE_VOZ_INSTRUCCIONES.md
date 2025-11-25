# 🎤 Instrucciones: Asistente de Voz Integrado

## ✅ Integración Completada

El asistente de voz ha sido integrado exitosamente en la landing page del Kit Esbelta.

---

## 📍 Ubicación de Archivos

```
landing-short-invisible/
├── index.html                 (Landing page con modal integrado)
├── asistente-voz/             (Asistente compilado)
│   ├── index.html
│   └── assets/
│       └── index-[hash].js
└── esbelta---asistente-de-voz/ (Código fuente del asistente)
    ├── App.tsx
    ├── .env.local             (⚠️ CONFIGURAR API KEY AQUÍ)
    └── ...
```

---

## 🎯 Funcionalidades Integradas

### ✅ Ya funcionando:
- 🔘 Botón flotante color coral (#F88379) con icono de micrófono
- 🪟 Modal responsive que carga el asistente
- 🎨 Diseño integrado con colores de Esbelta
- ⌨️ Cerrar con tecla ESC
- 📱 Responsive (móvil y desktop)
- 🔗 WhatsApp actualizado al número colombiano (+57 312 289 8771)

### 🎤 Asistente de Voz:
- Conversación por voz en tiempo real
- Agente de ventas especializado en fajas Esbelta
- Transcripción en español
- Interfaz estilo chat

---

## ⚠️ IMPORTANTE: Configurar API Key de Gemini

El asistente requiere una API key de Google Gemini para funcionar.

### Paso 1: Obtener API Key

1. Ve a https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la API key generada

### Paso 2: Configurar API Key

Edita el archivo `.env.local`:

```bash
# Ruta: landing-short-invisible/esbelta---asistente-de-voz/.env.local

# ANTES:
GEMINI_API_KEY=PLACEHOLDER_API_KEY

# DESPUÉS:
GEMINI_API_KEY=TU_API_KEY_REAL_AQUI
```

### Paso 3: Recompilar con la API Key Real

```bash
cd landing-short-invisible/esbelta---asistente-de-voz
npm run build
```

### Paso 4: Actualizar archivos en la landing

```bash
# Desde el directorio landing-short-invisible
cp -r esbelta---asistente-de-voz/dist/* asistente-voz/
```

---

## 🧪 Cómo Probar

### Método 1: Servidor Local Simple

```bash
cd landing-short-invisible
python -m http.server 8000
# O con Node.js:
npx serve .
```

Abre: `http://localhost:8000/index.html`

### Método 2: Abrir directamente

Abre el archivo `index.html` en tu navegador (puede tener limitaciones de permisos de micrófono).

### Método 3: Live Server (VSCode)

1. Instala extensión "Live Server" en VSCode
2. Click derecho en `index.html`
3. "Open with Live Server"

---

## 🎮 Uso del Asistente

1. **Abrir**: Click en el botón flotante coral con icono 🎤 (arriba del botón de WhatsApp)
2. **Permitir micrófono**: El navegador pedirá permisos de micrófono
3. **Hablar**: Click en "Comenzar" y empieza a hablar
4. **Conversar**: El asistente responde por voz y texto
5. **Detener**: Click en "Detener" o presiona ESC para cerrar

---

## 🎨 Personalización Realizada

### Colores de Esbelta:
- Botón flotante: `#F88379` (coral)
- Texto: `#2C1E1E` (chocolate oscuro)
- Fondo modal: Blanco con sombra

### Posición:
- Botón: `bottom-24 right-8` (arriba del botón de WhatsApp)
- Modal: Centrado, 90% altura viewport

---

## 🔧 Troubleshooting

### El asistente no responde:
✅ Verifica que configuraste una API key real
✅ Revisa la consola del navegador (F12) para errores
✅ Asegúrate de permitir permisos de micrófono

### Error de API:
```
Error: API key not valid
```
→ Verifica que la API key esté correctamente configurada en `.env.local` y recompila

### No se escucha al asistente:
✅ Verifica volumen del dispositivo
✅ Revisa permisos del navegador
✅ Prueba en Chrome/Edge (mejor compatibilidad)

### Modal no abre:
✅ Verifica que la ruta `asistente-voz/index.html` exista
✅ Abre la consola del navegador para ver errores de carga

---

## 📊 Arquitectura Técnica

### Stack del Asistente:
- **Framework**: React 19 + TypeScript
- **IA**: Google Gemini 2.5 Flash (Native Audio)
- **Build Tool**: Vite 6
- **Audio**: Web Audio API + MediaStream API
- **Voz**: Zephyr (voice preset de Gemini)

### Integración:
- **Método**: Iframe con sandbox
- **Comunicación**: Lazy loading (solo se carga al abrir)
- **Permisos**: `allow="microphone"`
- **Aislamiento**: Modal con z-index 9999

---

## 🚀 Próximos Pasos Opcionales

### Mejoras sugeridas:
1. **Agregar indicador visual** cuando el asistente está hablando
2. **Botón pulsante animado** para llamar más atención
3. **Agregar tooltip** "Habla con nuestro asistente"
4. **Historial de conversación** persistente
5. **Integración con WhatsApp** para continuar conversación

### Migración futura a React:
Si decides migrar toda la landing a React, el asistente puede integrarse como componente nativo (sin iframe), mejorando rendimiento y flexibilidad.

---

## 📞 Soporte

Si tienes dudas sobre la configuración o necesitas ayuda adicional, revisa:

- Documentación Gemini API: https://ai.google.dev/gemini-api/docs
- Repositorio del asistente: Carpeta `esbelta---asistente-de-voz/`
- Consola del navegador (F12) para logs de errores

---

¡El asistente de voz está listo para usar! 🎉
