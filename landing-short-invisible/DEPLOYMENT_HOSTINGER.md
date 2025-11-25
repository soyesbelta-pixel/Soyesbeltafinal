# 🚀 Guía de Deployment: Landing Page + Asistente de Voz en Hostinger

## 📋 Resumen Importante

### ✅ Qué es Hostinger
Hostinger es un **hosting estático** - solo sirve archivos HTML, CSS y JavaScript. NO tiene servidor backend.

### 🎯 Cómo funciona tu landing:
- **Landing page**: HTML + CSS + JavaScript (100% estático) ✅
- **Asistente de Voz**: React compilado a JavaScript estático ✅
- **API de Gemini**: Llamadas DIRECTAS desde el navegador del cliente ✅

**Resultado**: Todo funciona perfectamente en Hostinger sin necesidad de servidor propio.

---

## 🔒 SEGURIDAD: API Key Expuesta

### ⚠️ Problema
Tu API key (`AIzaSyAu5q5hZ_tzElD9YpU3CHJNUheeb1GMGc4`) está **incluida en el código JavaScript** que se envía al navegador. Esto significa que:

- ❌ Cualquiera puede ver tu API key en el código fuente
- ❌ Alguien podría copiarla y usarla en sus proyectos
- ❌ Podrías exceder el límite de uso de Google Gemini

### ✅ Solución URGENTE: Proteger la API Key

**DEBES hacer esto ANTES de subir a Hostinger:**

#### Paso 1: Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Inicia sesión con la misma cuenta de Google
3. Busca tu API key en la lista

#### Paso 2: Configurar Restricciones

Edita tu API key y configura:

**Restricción de aplicación:**
- Selecciona: **"Referentes HTTP (sitios web)"**
- Añade tu dominio de Hostinger:
  ```
  https://tudominio.com/*
  https://*.tudominio.com/*
  ```
  ⚠️ Reemplaza `tudominio.com` con tu dominio real de Hostinger

**Restricción de API:**
- Marca: **"Restringir clave"**
- Selecciona solo: **"Generative Language API"**

#### Paso 3: Guardar

Guarda los cambios. Ahora tu API key SOLO funcionará desde tu dominio de Hostinger.

---

## 📦 Archivos que debes subir a Hostinger

### Estructura completa:

```
landing-short-invisible/
├── index.html              ← Página principal
├── styles.css              ← Estilos
├── script.js               ← JavaScript de la landing
├── images/                 ← Imágenes de productos
│   ├── logo-esbelta.png
│   ├── short-negro-1.png
│   ├── cliente1.jpeg
│   ├── cliente2.jpeg
│   └── cliente3.jpeg
└── asistente-voz/          ← Asistente de voz compilado
    ├── index.html
    └── assets/
        └── index-[hash].js  ← JavaScript con API key incluida
```

**IMPORTANTE:**
- ✅ Sube TODO el contenido de `landing-short-invisible/`
- ✅ Incluye la carpeta `asistente-voz/` completa
- ❌ NO subas la carpeta `esbelta---asistente-de-voz/` (código fuente)

---

## 🔧 Pasos para Subir a Hostinger

### Método 1: File Manager (Recomendado para principiantes)

1. **Accede a Hostinger**
   - Inicia sesión en https://hpanel.hostinger.com
   - Ve a tu hosting → File Manager

2. **Navega a public_html**
   - Entra a la carpeta `public_html/` (o la carpeta raíz de tu dominio)

3. **Sube los archivos**
   - Click en "Upload"
   - **Opción A:** Sube archivo por archivo
     - `index.html`
     - `styles.css`
     - `script.js`
   - **Opción B:** Comprime en ZIP y sube
     - Comprime toda la carpeta `landing-short-invisible` en ZIP
     - Sube el ZIP
     - Descomprime en Hostinger (botón "Extract")

4. **Sube las carpetas**
   - Sube la carpeta `images/` completa
   - Sube la carpeta `asistente-voz/` completa

5. **Verifica la estructura**
   ```
   public_html/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── images/
   └── asistente-voz/
   ```

### Método 2: FTP (Para usuarios avanzados)

1. **Obtén credenciales FTP**
   - En Hostinger: Hosting → FTP Accounts
   - Anota: Host, Usuario, Contraseña, Puerto

2. **Conecta con FileZilla**
   - Descarga FileZilla: https://filezilla-project.org
   - Conecta usando las credenciales FTP

3. **Sube archivos**
   - Lado local: Selecciona carpeta `landing-short-invisible/`
   - Lado remoto: Navega a `public_html/`
   - Arrastra y suelta TODO el contenido

---

## 🌐 Configuración del Dominio

### Si usas dominio propio:
1. En Hostinger: Domains → Manage
2. Asegúrate que tu dominio apunta a este hosting
3. Espera propagación DNS (hasta 24 horas)

### Si usas subdominio gratuito de Hostinger:
- Ya está configurado automáticamente
- Ejemplo: `tuproyecto.hostingersite.com`

---

## ✅ Verificación Post-Deployment

### 1. Prueba la Landing Page
Visita: `https://tudominio.com`

**Debe mostrar:**
- ✅ Hero section con Kit Esbelta
- ✅ Testimonios en carrusel
- ✅ Sección de countdown (51% descuento)
- ✅ Botón flotante de WhatsApp (verde, abajo derecha)
- ✅ Botón flotante de Asistente (coral, arriba del WhatsApp)

### 2. Prueba el Asistente de Voz
1. Click en botón coral con icono 🎤
2. Debe abrir modal con asistente
3. Click en "Comenzar"
4. Permite acceso al micrófono
5. Habla: "Hola, quiero información sobre las fajas"
6. **Debe responder por voz y texto**

### 3. Verifica la API Key

**Si el asistente NO funciona:**
- Abre consola del navegador (F12)
- Busca errores como:
  ```
  Error: API key not valid
  Error: CORS blocked
  Error: 403 Forbidden
  ```

**Solución:**
- Ve a restricciones de API en Google Cloud Console
- Agrega tu dominio de Hostinger
- Espera 5-10 minutos para que se apliquen los cambios

---

## 🚨 Problemas Comunes y Soluciones

### ❌ "API key not valid"
**Causa:** Restricciones de dominio mal configuradas

**Solución:**
1. Ve a Google Cloud Console → API Credentials
2. Edita tu API key
3. En "Application restrictions" → "HTTP referrers"
4. Añade:
   ```
   https://tudominio.com/*
   https://*.tudominio.com/*
   ```
5. Guarda y espera 5 minutos

---

### ❌ Modal del asistente no abre
**Causa:** Ruta incorrecta del iframe

**Solución:**
Verifica que la carpeta `asistente-voz/` esté en la raíz:
```
public_html/
├── index.html
└── asistente-voz/  ← DEBE estar aquí
    └── index.html
```

---

### ❌ No se ve el botón flotante
**Causa:** Archivo `script.js` no se cargó o Lucide icons no inicializó

**Solución:**
1. Verifica que `script.js` esté en la raíz
2. Abre consola del navegador (F12)
3. Busca errores de carga de scripts
4. Verifica que Lucide CDN esté cargando: `https://unpkg.com/lucide@latest`

---

### ❌ Micrófono no funciona
**Causa:** Permisos del navegador o conexión no HTTPS

**Solución:**
1. **HTTPS es obligatorio** para micrófono
   - Hostinger ofrece SSL gratis
   - Activa SSL en Hostinger: Hosting → SSL → Activar
2. Permite permisos de micrófono en el navegador
3. Prueba en Chrome/Edge (mejor compatibilidad)

---

## 💰 Costos y Límites

### Google Gemini API (Gratis):
- **60 requests por minuto**
- **1,500 requests por día**
- **1 millón de tokens por mes**

Para un sitio pequeño, esto es **MÁS que suficiente**.

**Si excedes el límite:**
- Activa billing en Google Cloud
- O limita uso del asistente (ej: solo 5 minutos por sesión)

---

## 🔐 Seguridad Adicional Recomendada

### 1. Monitorea el uso de tu API
- Ve a: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics
- Revisa cuántas requests recibes diariamente
- Si ves uso sospechoso, regenera la API key

### 2. Considera un Backend Proxy (Futuro)
Si tu sitio crece mucho, considera:
- Crear un backend simple (Node.js, Python, PHP)
- El backend guarda la API key (no el cliente)
- Clientes hacen requests al backend
- Backend hace requests a Gemini

**Ventajas:**
- ✅ API key nunca expuesta
- ✅ Mayor control de uso
- ✅ Logging de conversaciones

**Desventaja:**
- ❌ Requiere hosting con soporte backend (no solo estático)

---

## 📊 Checklist Final Pre-Deployment

Antes de subir a Hostinger, verifica:

- [ ] API key configurada en el código
- [ ] Asistente recompilado (`npm run build`)
- [ ] Restricciones de API configuradas en Google Cloud
- [ ] Dominio añadido a restricciones
- [ ] Número de WhatsApp correcto (+57 312 289 8771)
- [ ] Todas las imágenes en carpeta `/images/`
- [ ] Carpeta `/asistente-voz/` lista con archivos compilados
- [ ] Código fuente (`esbelta---asistente-de-voz/`) NO incluido

---

## 🎉 ¡Listo para Producción!

Tu landing page está completamente lista para Hostinger. Todo funcionará sin necesidad de servidor porque:

✅ **Landing**: HTML/CSS/JS estático
✅ **Asistente**: React compilado a JavaScript estático
✅ **API**: Llamadas directas desde el navegador a Gemini
✅ **Imágenes**: Servidas estáticamente por Hostinger

**No se requiere:**
- ❌ Servidor Node.js
- ❌ Servidor Python
- ❌ Base de datos
- ❌ Backend propio

Todo es **client-side** (lado del cliente) 🚀

---

## 📞 Soporte

Si tienes problemas después del deployment:

1. **Revisa la consola del navegador** (F12) para errores
2. **Verifica restricciones de API** en Google Cloud Console
3. **Prueba en modo incógnito** para descartar caché
4. **Verifica SSL** esté activo en Hostinger (candado verde en URL)

¡Éxito con tu deployment! 🎊
