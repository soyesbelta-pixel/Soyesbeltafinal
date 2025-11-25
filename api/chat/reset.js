import OpenRouterService from '../../services/openRouterService.js';

// Instancia única compartida entre invocaciones
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
    const { sessionId } = req.body;

    // Obtener servicio
    const service = getOpenRouterService();

    // Resetear chat
    service.resetChat(sessionId || 'default');

    res.status(200).json({
      success: true,
      message: 'Chat reset successfully'
    });

  } catch (error) {
    console.error('Error in /api/chat/reset:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
