import express from 'express';

const router = express.Router();

// POST /api/chat/message - Enviar mensaje al chatbot
router.post('/message', async (req, res) => {
  try {
    const { message, context, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Obtener el servicio de OpenRouter desde app locals
    const openRouterService = req.app.locals.openRouterService;

    // Enviar mensaje
    const response = await openRouterService.sendMessage(
      sessionId || 'default',
      message,
      context || {}
    );

    res.json({
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
});

// POST /api/chat/reset - Resetear conversación
router.post('/reset', async (req, res) => {
  try {
    const { sessionId } = req.body;

    const openRouterService = req.app.locals.openRouterService;
    openRouterService.resetChat(sessionId || 'default');

    res.json({
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
});

export default router;
