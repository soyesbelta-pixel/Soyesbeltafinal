import express from 'express';

const router = express.Router();

/**
 * POST /api/virtual-tryon/generate
 * Generate virtual try-on image
 *
 * Body:
 * - userImageBase64: Base64 encoded user image (data URL)
 * - productImageBase64: Base64 encoded product image (data URL)
 * - product: Product information (name, description, prompt)
 */
router.post('/generate', async (req, res) => {
  try {
    const { userImageBase64, productImageBase64, product } = req.body;

    // Validación de entrada
    if (!userImageBase64 || !productImageBase64 || !product) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'userImageBase64, productImageBase64, and product are required'
      });
    }

    if (!product.name) {
      return res.status(400).json({
        error: 'Invalid product',
        details: 'product.name is required'
      });
    }

    // Validar que sean data URLs válidas
    if (!userImageBase64.startsWith('data:image/') || !productImageBase64.startsWith('data:image/')) {
      return res.status(400).json({
        error: 'Invalid image format',
        details: 'Images must be base64 data URLs (e.g., data:image/jpeg;base64,...)'
      });
    }

    // Obtener el servicio Gemini del app.locals
    const geminiService = req.app.locals.geminiService;

    if (!geminiService) {
      return res.status(500).json({
        error: 'Service not initialized',
        details: 'Gemini service is not available'
      });
    }

    // Generar la imagen de prueba virtual
    const result = await geminiService.generateTryOnImage(
      userImageBase64,
      productImageBase64,
      product
    );

    // Retornar el resultado
    res.json({
      success: true,
      image: result.image,
      text: result.text
    });

  } catch (error) {
    console.error('Error generating virtual try-on:', error);

    // Retornar error con mensaje apropiado
    res.status(500).json({
      error: 'Generation failed',
      message: error.message || 'Failed to generate virtual try-on image'
    });
  }
});

/**
 * GET /api/virtual-tryon/health
 * Health check for virtual try-on service
 */
router.get('/health', (req, res) => {
  const geminiService = req.app.locals.geminiService;

  res.json({
    status: geminiService ? 'ok' : 'unavailable',
    service: 'virtual-tryon',
    timestamp: new Date().toISOString()
  });
});

export default router;
