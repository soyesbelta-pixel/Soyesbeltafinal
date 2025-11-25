# Backend Setup - Esbelta

Backend proxy seguro para proteger API keys del chatbot.

## 🚀 Inicio Rápido

### 1. Instalar dependencias del backend
```bash
cd server
npm install
```

### 2. Iniciar el backend
```bash
cd server
npm run dev
```

Deberías ver:
```
🚀 Esbelta Backend Server
📍 Running on: http://localhost:3001
🌍 Environment: development
✅ OpenRouter API: Connected
🛡️  Rate Limiting: 20 requests/minute
```

### 3. En otra terminal, iniciar el frontend
```bash
# Desde la raíz del proyecto
npm run dev
```

El frontend (http://localhost:5173) ahora se comunicará con el backend (http://localhost:3001) de forma automática.

## 🔒 Seguridad

### API Keys Protegidas
Las claves de OpenRouter ahora están en `server/.env` (que está en .gitignore) y NUNCA se exponen al navegador.

**ANTES** (inseguro):
```
Usuario → Frontend (API key visible) → OpenRouter
```

**AHORA** (seguro):
```
Usuario → Frontend → Backend (API key oculta) → OpenRouter
```

### Rate Limiting
El backend limita a 20 requests por minuto por IP para prevenir abuso.

## 📁 Estructura del Backend

```
server/
├── index.js                    # Servidor Express principal
├── routes/
│   └── chat.js                 # Rutas de chat (/api/chat/message, /api/chat/reset)
├── services/
│   └── openRouterService.js    # Lógica de OpenRouter (movida del frontend)
├── middleware/
│   └── rateLimiter.js          # Rate limiting personalizado
├── .env                        # API keys (NO commitear)
├── .env.example                # Template de configuración
└── package.json                # Dependencias
```

## 🧪 Probar el Backend

### Health Check
```bash
curl http://localhost:3001/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "uptime": 42.123
}
```

### Probar Chat
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "hola",
    "sessionId": "test_session",
    "context": {
      "products": []
    }
  }'
```

## 🔄 Rollback (Si algo falla)

Si el chatbot no funciona con el backend, puedes volver a la versión anterior:

```bash
# Restaurar el archivo original de OpenRouterService
cp src/services/OpenRouterService.js.backup src/services/OpenRouterService.js

# Reiniciar frontend
npm run dev
```

## 🌐 Despliegue a Producción

### Backend
1. Deploya el backend en Render, Railway, o similar
2. Configura las variables de entorno en el servicio
3. Anota la URL del backend (ej: `https://esbelta-backend.onrender.com`)

### Frontend
1. Actualiza `.env.local`:
```
VITE_BACKEND_URL=https://esbelta-backend.onrender.com
```

2. Reconstruye el frontend:
```bash
npm run build
```

## 📊 Monitoreo

El backend registra todas las peticiones:
```
2025-01-10T12:00:00.000Z - POST /api/chat/message
2025-01-10T12:00:01.000Z - POST /api/chat/message
```

## ❓ Preguntas Frecuentes

**P: ¿El chatbot funciona igual que antes?**
R: Sí, exactamente igual. Solo cambiamos dónde está la API key (ahora segura en el backend).

**P: ¿Necesito cambiar algo en el frontend?**
R: No, el cambio es transparente. Solo asegúrate de tener `VITE_BACKEND_URL` en `.env.local`.

**P: ¿Qué pasa si el backend está apagado?**
R: El chatbot mostrará un mensaje de error amigable: "No puedo conectarme al servidor..."

**P: ¿Puedo usar el probador virtual sin backend?**
R: Sí, el probador virtual es independiente. Solo el chatbot necesita el backend.

## 🆘 Soporte

Si tienes problemas:
1. Verifica que el backend esté corriendo (`http://localhost:3001/health`)
2. Revisa la consola del navegador para errores
3. Revisa los logs del servidor backend
4. Verifica que `.env.local` tenga `VITE_BACKEND_URL=http://localhost:3001`
