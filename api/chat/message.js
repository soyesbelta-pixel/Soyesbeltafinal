import OpenRouterService from '../../services/openRouterService.js';

// Instancia única compartida entre invocaciones (Vercel cachea esto)
let openRouterService = null;

function getOpenRouterService() {
  if (!openRouterService) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }
    openRouterService = new OpenRouterService(apiKey);
  }
  return openRouterService;
}

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    const { message, context, sessionId } = req.body;

    // Validación de entrada
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Obtener servicio
    const service = getOpenRouterService();

    // Enviar mensaje
    const response = await service.sendMessage(
      sessionId || 'default',
      message,
      context || {}
    );

    res.status(200).json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/chat/message:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
