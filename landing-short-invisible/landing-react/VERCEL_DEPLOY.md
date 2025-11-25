# 🚀 Instrucciones para Deploy en Vercel

## 📋 Archivos de Variables de Entorno

### Local (.env)
El archivo `.env` contiene tu API key real y está en `.gitignore` (NO se sube a GitHub):

```env
VITE_GEMINI_API_KEY=AIzaSyAu5q5hZ_tzElD9YpU3CHJNUheeb1GMGc4
```

**Ubicación**: `E:\CAPITAN NOLASCO\4\Hecho\RESPALDO\landing-short-invisible\landing-react\.env`

### Plantilla (.env.example)
Este archivo SÍ está en GitHub como referencia:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## 🔧 Pasos para Deploy en Vercel

### 1. Preparación

✅ Archivos ya configurados:
- `.env` → Creado con tu API key
- `.env.example` → Subido a GitHub
- `.gitignore` → Actualizado para excluir `.env`
- `App.jsx` → Usa `import.meta.env.VITE_GEMINI_API_KEY`

### 2. Deploy desde Vercel Dashboard

#### Opción A: Importar desde GitHub (Recomendado)

1. **Ir a Vercel**: https://vercel.com
2. **Iniciar sesión** con tu cuenta
3. **Click en "Add New Project"**
4. **Importar repositorio**:
   - Busca: `soyesbelta-pixel/lanfing-2-`
   - Click "Import"

5. **Configurar Proyecto**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `dist` (automático)

6. **⚠️ IMPORTANTE: Agregar Variables de Entorno**:

   En la sección "Environment Variables":

   | Name | Value |
   |------|-------|
   | `VITE_GEMINI_API_KEY` | `AIzaSyAu5q5hZ_tzElD9YpU3CHJNUheeb1GMGc4` |

   - Click "Add"
   - Seleccionar: ☑️ Production ☑️ Preview ☑️ Development

7. **Click "Deploy"**

8. **Esperar 2-3 minutos** mientras Vercel hace el build

9. **¡Listo!** Tu sitio estará en: `https://lanfing-2-.vercel.app`

#### Opción B: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (desde la carpeta landing-react)
cd "E:\CAPITAN NOLASCO\4\Hecho\RESPALDO\landing-short-invisible\landing-react"
vercel

# Cuando pregunte por variables de entorno:
# VITE_GEMINI_API_KEY = AIzaSyAu5q5hZ_tzElD9YpU3CHJNUheeb1GMGc4

# Deploy a producción
vercel --prod
```

### 3. Configuración Post-Deploy

#### Verificar Variables de Entorno

1. En Vercel Dashboard → Tu proyecto
2. Settings → Environment Variables
3. Deberías ver:
   ```
   VITE_GEMINI_API_KEY = AIzaSy... (oculta)
   ```

#### Redeploy si es necesario

Si olvidaste agregar la variable de entorno:

1. Settings → Environment Variables → Add
2. Agregar: `VITE_GEMINI_API_KEY = AIzaSyAu5q5hZ_tzElD9YpU3CHJNUheeb1GMGc4`
3. Deployments → Click en el último deployment → "Redeploy"

### 4. Verificar que Funcione

Una vez deployado, verifica:

✅ **Asistente de Voz**:
- Click en el botón flotante Siri
- Prueba hablar
- Debe responder con Gemini AI

✅ **Virtual Try-On**:
- Click en "Prueba Virtual con IA"
- Sube una foto
- Selecciona producto
- Debe generar imágenes con IA

### 5. Dominios (Opcional)

#### Dominio Gratuito
Vercel te da automáticamente:
```
https://lanfing-2-.vercel.app
```

#### Dominio Personalizado
1. Settings → Domains
2. Agregar tu dominio (ej: `esbelta.com`)
3. Configurar DNS según instrucciones

## 🔐 Seguridad

### ⚠️ NUNCA subas .env a GitHub
El `.env` está en `.gitignore` para proteger tu API key.

### ✅ Variables de Entorno en Vercel
Vercel maneja las variables de forma segura:
- Cifradas en tránsito y reposo
- No visibles en el código fuente
- Accesibles solo en tiempo de build/runtime

### 🔄 Rotar API Key
Si necesitas cambiar la API key:

1. Obtener nueva key en: https://aistudio.google.com/apikey
2. Actualizar en Vercel:
   - Settings → Environment Variables
   - Edit `VITE_GEMINI_API_KEY`
   - Guardar
3. Redeploy
4. Actualizar `.env` local

## 🐛 Troubleshooting

### Error: "API key not defined"
**Solución**:
1. Verifica que agregaste `VITE_GEMINI_API_KEY` en Vercel
2. Redeploy el proyecto
3. Verifica que el nombre sea exacto (case-sensitive)

### Error: Build failed
**Solución**:
1. Verifica que `package.json` tenga todas las dependencias
2. Limpia cache: Settings → Clear Cache → Redeploy

### Asistente de voz no responde
**Solución**:
1. Abre DevTools (F12) → Console
2. Busca errores relacionados con API
3. Verifica que la API key sea válida
4. Revisa límites de uso en Google AI Studio

### Virtual Try-On no genera imágenes
**Solución**:
1. Verifica que el modelo `gemini-2.5-flash-image` esté disponible
2. Revisa cuota de API en Google AI Studio
3. Intenta con imagen más pequeña (< 1MB)

## 📊 Monitoreo

### Analytics en Vercel
Vercel Dashboard → Analytics:
- Visitantes
- Páginas vistas
- Tiempos de carga
- Errores

### Logs
Vercel Dashboard → Deployments → Click deployment → Runtime Logs

## 💰 Costos

### Vercel
- ✅ **Hobby Plan (Gratis)**:
  - 100 GB bandwidth/mes
  - Proyectos ilimitados
  - Perfecto para este landing

### Gemini API
- ✅ **Free Tier**:
  - 1,500 requests/día
  - Suficiente para landing page

## 🔗 Enlaces Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Repositorio GitHub**: https://github.com/soyesbelta-pixel/lanfing-2-
- **Gemini API Keys**: https://aistudio.google.com/apikey
- **Vercel Docs**: https://vercel.com/docs

---

**¿Necesitas ayuda?** Revisa los logs en Vercel o contacta soporte técnico.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
