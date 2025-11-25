import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_ID = 'google/gemini-2.5-flash-image-preview';

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not provided to GeminiService");
    }
    this.apiKey = apiKey;
  }

  /**
   * Generates a professional, restriction-avoiding prompt using technical references
   * This format emphasizes e-commerce catalog context and professional standards
   */
  generateProfessionalPrompt(productDescription, productName) {
    const isOpaque = !productDescription.toLowerCase().includes('transparent');
    const opaqueText = isOpaque ? 'OPACA ' : '';

    return `Referencias:
A = cliente/modelo - PRIMERA IMAGEN PROPORCIONADA (persona completa).
B = ${productName} - SEGUNDA IMAGEN PROPORCIONADA (prenda de referencia exacta).

INSTRUCCIÓN FUNDAMENTAL:
Crear imagen profesional de catálogo e-commerce donde la persona A viste la prenda B manteniendo 100% la identidad facial original y respetando la anatomía natural del cuerpo.

PRESERVACIÓN DE IDENTIDAD:
- MANTENER EXACTAMENTE el rostro, cabello y rasgos faciales de la persona A
- PRESERVAR la complexión y proporciones corporales naturales de A
- La prenda debe adaptarse naturalmente al cuerpo sin deformarlo
- Ajuste profesional y favorecedor que realce la figura de forma elegante

Tarea Principal:
Mostrar a la persona A vistiendo EXACTAMENTE la prenda de la imagen B:
- Si es una faja/prenda modeladora: mostrar ajuste profesional que define la silueta de forma natural
- La prenda debe verse exactamente como en imagen B (mismo color, diseño, detalles)
- Adaptación natural al cuerpo manteniendo proporciones realistas
- Resultado profesional tipo catálogo de moda deportiva/fitness

COMPOSICIÓN PROFESIONAL:
Generar UNA imagen con DOS VISTAS de catálogo:
- Panel izquierdo: Vista frontal profesional, postura erguida natural
- Panel derecho: Vista lateral 3/4 mostrando el ajuste y forma de la prenda
- Ambas vistas con la MISMA prenda exacta de imagen B
- Poses profesionales de catálogo, naturales y elegantes

FIDELIDAD DEL PRODUCTO:
- Color IDÉNTICO al de la imagen B de referencia
- Diseño y corte EXACTO de la prenda original
- Todos los detalles, costuras y características del producto B
- Si es prenda modeladora/faja, mostrar su efecto natural de soporte

ESTILO CATÁLOGO PROFESIONAL:
- Iluminación de estudio fotográfico profesional
- Fondo gris claro neutro uniforme con patrón de marca de agua repetido "Soy Esbelta" en todo el fondo (múltiples veces distribuido uniformemente en patrón diagonal, texto en color MARRÓN CHOCOLATE (#3B2F2F) VISIBLE claramente legible como watermark profesional)
- Composición equilibrada y simétrica
- Calidad fotográfica alta definición
- Enfoque nítido en rostro y prenda

ESTÁNDARES PROFESIONALES:
- Imagen apta para catálogo e-commerce internacional
- Presentación respetuosa y profesional
- Énfasis en la calidad y ajuste del producto
- Resultado tipo fotografía de moda deportiva profesional
- Sin modificación de rasgos faciales o corporales
- Mantener naturalidad y elegancia
- Prenda completamente opaca con cobertura profesional`;
  }

  /**
   * Generate virtual try-on image
   * @param {string} userImageBase64 - Base64 encoded user image
   * @param {string} productImageBase64 - Base64 encoded product image
   * @param {object} product - Product information
   * @returns {Promise<{image: string, text: string}>}
   */
  async generateTryOnImage(userImageBase64, productImageBase64, product) {
    try {
      // Generate professional prompt to avoid restrictions
      const professionalPrompt = this.generateProfessionalPrompt(
        product.prompt || product.description || '',
        product.name
      );

      // Prepare the request payload with both images
      const payload = {
        model: MODEL_ID,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: professionalPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: userImageBase64
                }
              },
              {
                type: "image_url",
                image_url: {
                  url: productImageBase64
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"],
        temperature: 0.4, // Lower temperature for more conservative, professional results
        max_tokens: 8192,
        top_p: 0.9
      };

      // Make the API request
      const response = await axios.post(
        OPENROUTER_API_URL,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://esbelta.com',
            'X-Title': 'Professional E-commerce Catalog - Esbelta'
          },
          timeout: 60000 // 60 seconds timeout for image generation
        }
      );

      // Extract the generated image and text from response
      let generatedImage = null;
      let generatedText = null;

      if (response.data?.choices?.[0]?.message) {
        const message = response.data.choices[0].message;

        // Check for generated images
        if (message.images && message.images.length > 0) {
          const imageData = message.images[0];
          if (imageData.type === 'image_url' && imageData.image_url?.url) {
            generatedImage = imageData.image_url.url;
          }
        }

        // Check for generated text
        if (message.content) {
          generatedText = message.content;
        }
      }

      if (!generatedImage) {
        throw new Error("No se pudo generar la imagen. Por favor intenta con una descripción de producto diferente o asegúrate de que sigue los estándares profesionales del catálogo.");
      }

      return { image: generatedImage, text: generatedText };
    } catch (error) {
      // Handle specific API errors with more helpful messages
      if (error.response?.status === 401) {
        throw new Error("Falló la autenticación. Por favor verifica tu clave API de OpenRouter.");
      } else if (error.response?.status === 429) {
        throw new Error("Límite de velocidad excedido. Por favor intenta de nuevo más tarde.");
      } else if (error.response?.data?.error?.message?.includes('safety') ||
                 error.response?.data?.error?.message?.includes('blocked') ||
                 error.response?.data?.error?.message?.includes('inappropriate')) {
        throw new Error("El contenido fue bloqueado por razones de seguridad. Por favor asegúrate de que tu descripción del producto es apropiada para un catálogo profesional e intenta usar terminología más técnica de la industria de la moda.");
      } else if (error.response?.data?.error) {
        throw new Error(`Error de API: ${error.response.data.error.message || 'Error desconocido'}`);
      }

      throw error;
    }
  }
}

export default GeminiService;
