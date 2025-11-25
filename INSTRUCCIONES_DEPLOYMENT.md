# 🚀 Instrucciones de Deployment - Paso a Paso

## ✅ Ya Completado

- ✅ Repositorio Git inicializado
- ✅ Todos los archivos agregados (615 archivos)
- ✅ Commit inicial creado
- ✅ Archivos .env protegidos en .gitignore
- ✅ Build test exitoso

---

## 📝 Paso 1: Subir a GitHub (5-10 minutos)

### 1.1 Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Inicia sesión en tu cuenta
3. Click en el **botón "+"** (arriba derecha) → **"New repository"**
4. Configura el repositorio:
   - **Repository name**: `esbelta-ecommerce` (o el nombre que prefieras)
   - **Description**: "E-commerce de fajas colombianas con chatbot IA y probador virtual"
   - **Visibility**: `Private` (recomendado) o `Public`
   - ❌ **NO** marcar "Add a README file"
   - ❌ **NO** agregar .gitignore
   - ❌ **NO** agregar license
5. Click en **"Create repository"**

### 1.2 Conectar Repositorio Local con GitHub

GitHub te mostrará instrucciones. Usa estas comandos en tu terminal:

```bash
# Navega a tu proyecto
cd "E:\CAPITAN NOLASCO\4\Hecho\acabadoo"

# Agrega el remote de GitHub (reemplaza TU-USUARIO con tu nombre de usuario)
git remote add origin https://github.com/TU-USUARIO/esbelta-ecommerce.git

# Renombra la rama a main
git branch -M main

# Sube el código a GitHub
git push -u origin main
```

**Importante**: Cuando te pida usuario y contraseña, GitHub ahora requiere un **Personal Access Token** en lugar de contraseña. Si no tienes uno:

1. Ve a GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Dale permisos: `repo` (todos los checkboxes de repositorio)
4. Copia el token y úsalo como contraseña

### 1.3 Verificar que se subió correctamente

Actualiza la página de tu repositorio en GitHub y deberías ver todos tus archivos.

---

## 🚀 Paso 2: Deploy en Vercel (10 minutos)

### 2.1 Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"**
3. **Importante**: Usa **"Continue with GitHub"** (más fácil para conectar repositorios)
4. Autoriza a Vercel para acceder a tus repositorios

### 2.2 Importar Proyecto

1. En el dashboard de Vercel, click en **"Add New..."** → **"Project"**
2. Busca tu repositorio `esbelta-ecommerce` en la lista
3. Click en **"Import"**

### 2.3 Configurar Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica la configuración:

- **Framework Preset**: `Vite` ✅
- **Root Directory**: `./` (dejar por defecto) ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

### 2.4 Configurar Variables de Entorno

**ANTES de hacer deploy**, click en **"Environment Variables"** y agrega:

#### Variables Backend (API):

| Name | Value |
|------|-------|
| `OPENROUTER_API_KEY` | `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` |

#### Variables Frontend (VITE_*):

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://kynogljhbbvagneiydrk.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm9nbGpoYmJ2YWduZWl5ZHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzcxOTMsImV4cCI6MjA3NDc1MzE5M30.7AErxHnRgIUtlNizsPzjn-B5wBpy_U5yEw5nTx-8U9g` |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm9nbGpoYmJ2YWduZWl5ZHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzE5MywiZXhwIjoyMDc0NzUzMTkzfQ.s278KYIxYqW35fAeKB6ntT6EwKKJnZ7XWsBtSakIcdc` |
| `VITE_USE_SUPABASE` | `true` |

**Para cada variable**:
1. Escribe el **Name** (nombre de la variable)
2. Escribe el **Value** (valor correspondiente)
3. Asegúrate que esté marcado para **Production**, **Preview**, y **Development**
4. Click **"Add"**

**Importante**: **NO agregues `VITE_BACKEND_URL`** - Vercel usará rutas relativas automáticamente.

### 2.5 Deploy

1. Revisa que todas las variables estén agregadas
2. Click en **"Deploy"**
3. Espera 2-5 minutos mientras Vercel hace el build

Verás el progreso en tiempo real:
- Building... (compilando el proyecto)
- Running Checks... (verificaciones)
- Deploying... (subiendo a la CDN)

### 2.6 Verificar Deployment

Una vez completado:
1. Vercel te mostrará **"Congratulations!"** 🎉
2. Click en **"Visit"** o copia la URL (ej: `https://esbelta-ecommerce.vercel.app`)
3. Tu sitio está **LIVE** ✅

---

## 🧪 Paso 3: Probar Funcionalidades (5 minutos)

### 3.1 Verificar Frontend
1. Abre tu URL de Vercel
2. Verifica que el sitio carga correctamente
3. Navega por las páginas (inicio, productos, etc.)

### 3.2 Probar Chatbot
1. Click en el icono del chatbot (esquina inferior derecha)
2. Escribe "Hola"
3. Deberías recibir respuesta de Sofia ✅

Si el chatbot NO responde:
- Ve a Vercel Dashboard → tu proyecto → **Functions** tab
- Click en `api/chat/message.js`
- Revisa los logs para ver errores

### 3.3 Probar Probador Virtual
1. Click en **"Probador Virtual"** en el menú
2. Sube una foto tuya
3. Selecciona un producto
4. Click en **"Probar Ahora"**
5. Deberías ver la imagen generada ✅

Si el probador NO funciona:
- Verifica que `OPENROUTER_API_KEY` esté correctamente configurada
- Revisa los logs en Functions → `api/virtual-tryon/generate.js`

---

## 🔍 Paso 4: Monitorear y Debugging

### Ver Logs en Tiempo Real

1. Ve a Vercel Dashboard
2. Click en tu proyecto
3. Ve a **Deployments**
4. Click en el deployment actual
5. Ve a **Functions** tab
6. Selecciona la función que quieres monitorear:
   - `api/chat/message.js` - Chatbot
   - `api/virtual-tryon/generate.js` - Probador virtual
7. Verás los logs en tiempo real

### Errores Comunes

#### Error: "OPENROUTER_API_KEY not configured"
**Solución**: Ve a Settings → Environment Variables y asegúrate que `OPENROUTER_API_KEY` está agregada para **Production**.

#### Error: "Function exceeded timeout"
**Solución**: Las funciones tienen límite de 30 segundos. Para imágenes muy grandes en el probador, considera optimizar el tamaño.

#### Chatbot no responde
**Solución**:
1. Verifica que la API key tenga créditos en [openrouter.ai](https://openrouter.ai)
2. Revisa los logs de la función
3. Verifica que no hay errores en la consola del navegador (F12)

---

## 🌐 Paso 5: Dominio Personalizado (Opcional)

### Agregar tu propio dominio

1. Ve a tu proyecto en Vercel
2. Settings → **Domains**
3. Click **"Add"**
4. Ingresa tu dominio (ej: `esbelta.com` o `www.esbelta.com`)
5. Vercel te dará instrucciones para configurar DNS:
   - **Tipo A Record**: Apunta a la IP de Vercel
   - **Tipo CNAME**: Apunta a `cname.vercel-dns.com`
6. Configura esto en tu proveedor de dominio (GoDaddy, Namecheap, etc.)
7. Espera 24-48 horas para propagación DNS

**Vercel automáticamente**:
- Generará certificado SSL (HTTPS) ✅
- Configurará el dominio ✅
- Redirigirá www → no-www (o viceversa) ✅

---

## 🔄 Paso 6: Actualizaciones Futuras

### Cada vez que hagas cambios:

```bash
# 1. Haz tus cambios en el código

# 2. Agrega los cambios a Git
git add .

# 3. Crea un commit
git commit -m "Descripción de los cambios"

# 4. Sube a GitHub
git push origin main
```

**Vercel automáticamente**:
1. Detecta el push a GitHub
2. Hace build del nuevo código
3. Despliega la nueva versión
4. ¡Todo en 2-3 minutos! 🚀

---

## 📊 Métricas de Vercel (Gratis)

Vercel te da métricas gratis:

### Analytics
- Pageviews (visitas)
- Unique visitors (visitantes únicos)
- Top pages (páginas más visitadas)
- Geographic distribution (de dónde son tus usuarios)

### Functions
- Invocations (cuántas veces se llaman tus APIs)
- Errors (errores en las funciones)
- Duration (tiempo de ejecución)

Para verlas:
1. Dashboard → tu proyecto
2. **Analytics** tab
3. **Functions** tab

---

## 🎯 Límites del Plan Gratuito

### Lo que incluye GRATIS:

- ✅ 100 GB bandwidth/mes
- ✅ 100 GB-hrs compute/mes
- ✅ Deployments ilimitados
- ✅ Preview deployments para PRs
- ✅ SSL automático
- ✅ CDN global
- ✅ 1 dominio custom

**Esto es MUCHO más que suficiente para tu proyecto** 🎉

### Si excedes los límites:

Vercel te notificará y puedes:
1. Optimizar el sitio (comprimir imágenes, etc.)
2. Upgrade a plan Pro ($20/mes) si realmente creces mucho

---

## 🆘 Soporte y Ayuda

### Recursos:

- **Documentación Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Logs del proyecto**: Vercel Dashboard → Functions
- **Guía completa**: Lee `DEPLOY_VERCEL.md` en tu proyecto

### Si algo falla:

1. **Revisa los logs** en Vercel Dashboard → Functions
2. **Verifica variables de entorno** en Settings → Environment Variables
3. **Prueba localmente primero**: `npm run build` debe funcionar
4. **Revisa la consola del navegador** (F12)

---

## ✅ Checklist Final

Antes de considerar el deployment completo:

- [ ] ✅ Código subido a GitHub
- [ ] ✅ Proyecto importado en Vercel
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Deployment exitoso (sin errores)
- [ ] ✅ Sitio carga correctamente
- [ ] ✅ Chatbot responde
- [ ] ✅ Probador virtual genera imágenes
- [ ] ✅ Todos los productos se ven bien
- [ ] ✅ Carrito funciona
- [ ] ✅ WhatsApp links funcionan

---

## 🎉 ¡Felicidades!

Tu e-commerce está **LIVE EN PRODUCCIÓN** 🚀

**Tu URL de Vercel**: `https://tu-proyecto.vercel.app`

Compártela con tus clientes y empieza a vender 💰

---

**¿Necesitas hacer cambios?** Simplemente edita el código, haz `git push`, y Vercel se encargará del resto ✨
