// Las variables de entorno se cargan automáticamente vía loadEnv.js (ver package.json)
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import virtualTryonRouter from './routes/virtualTryon.js';
import emailsRouter from './routes/emails.js';
import OpenRouterService from './services/openRouterService.js';
import GeminiService from './services/geminiService.js';
import RateLimiter from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Verificar API keys
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ ERROR: OPENROUTER_API_KEY no está configurada en .env');
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('❌ ERROR: RESEND_API_KEY no está configurada en .env');
  process.exit(1);
}

// Inicializar OpenRouter Service
const openRouterService = new OpenRouterService(process.env.OPENROUTER_API_KEY);
app.locals.openRouterService = openRouterService;

// Inicializar Gemini Service (para probador virtual)
const geminiService = new GeminiService(process.env.OPENROUTER_API_KEY);
app.locals.geminiService = geminiService;

// Inicializar Rate Limiter
const rateLimiter = new RateLimiter(20, 60000); // 20 requests por minuto
rateLimiter.startCleanup();

// Middlewares
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));
// Aumentar límite de payload para imágenes base64 (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting para todas las rutas API
app.use('/api/', rateLimiter.middleware());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/virtual-tryon', virtualTryonRouter);
app.use('/api/emails', emailsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Esbelta Backend Server`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ OpenRouter API: Connected`);
  console.log(`🎨 Virtual Try-On: Ready`);
  console.log(`📧 Email Service (Resend): Ready`);
  console.log(`🛡️  Rate Limiting: 20 requests/minute\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
