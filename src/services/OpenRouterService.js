import { products } from '../data/products';

// API del backend
// En desarrollo: http://localhost:3001
// En producción (Vercel): '' (rutas relativas /api/*)
const BACKEND_URL = import.meta.env.MODE === 'production'
  ? ''
  : 'http://localhost:3001';

class OpenRouterService {
  constructor() {
    this.conversationHistory = [];
    // Caché de respuestas frecuentes para respuestas instantáneas
    this.responseCache = new Map();
    this.initializeCache();
    // Session ID único para mantener conversación en el backend
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  initializeCache() {
    // Cachear respuestas comunes con enfoque profesional de venta
    this.responseCache.set('hola', 'Hola, soy Alexa, tu asesora de Esbelta - Fajas Colombianas Premium. Tenemos **-10% de descuento** en toda la colección. Para recomendarte el producto ideal: ¿Qué zona quieres moldear? (abdomen, cintura, glúteos, completo)');
    this.responseCache.set('buenos dias', 'Buenos días, soy Alexa de Esbelta. Tenemos **promociones activas** en fajas premium colombianas. ¿Qué necesidad específica tienes? (control abdominal, levanta cola, moldeadora completa, corrector de postura)');
    this.responseCache.set('buenas tardes', 'Buenas tardes, soy Alexa de Esbelta. Nuestras fajas están con **-10% de descuento** y tenemos **stock limitado** en varios modelos. ¿Para qué ocasión necesitas la faja? (uso diario, evento especial, postparto)');
    this.responseCache.set('buenas noches', 'Buenas noches, soy Alexa de Esbelta. Te puedo ayudar a seleccionar la faja perfecta según tu necesidad. ¿Qué nivel de compresión buscas? (ligera, media, alta)');
    this.responseCache.set('gracias', 'Con gusto. Recuerda que tenemos **-10% de descuento**, **envío GRATIS** en compras superiores a $150,000 COP y nuestro **Probador Virtual con IA** para que veas cómo te quedaría antes de comprar. ¿Necesitas ayuda con algo más o procedo a enviarte el enlace de compra por WhatsApp?');
    this.responseCache.set('adios', 'Hasta pronto. No olvides: **-10% de descuento** activo, **envío GRATIS** en compras +$150,000 COP, y puedes probarte las fajas virtualmente con IA (Menú → Probador Virtual). Para ordenar escríbenos al WhatsApp +57 312 2898771');
    this.responseCache.set('precio', '💰 **Precios con descuento** (Pesos Colombianos):\n\n• **Brasier Corrector Postura**: $69,000 COP (-10%) ⭐ 4.7/5\n• **Cachetero Control Abdomen Alto**: $75,000 COP (-10%) ⭐ 4.8/5\n• **Short Levanta Cola Magic**: $79,000 COP (-10%) ⭐ 4.8/5\n• **Short Levanta Glúteo Invisible**: $79,000 COP (-10%) ⭐ 4.9/5\n• **Cinturilla Premium Reloj Arena**: $165,000 COP (-10%) ⭐ 4.8/5\n\n✅ **Envío GRATIS** en compras +$150,000\n\n¿Cuál se ajusta a tu necesidad?');
    this.responseCache.set('envio', '🚚 **Política de Envíos:**\n\n✅ Cobertura: Todo el país\n✅ **Envío GRATIS** en compras superiores a $150,000 COP\n✅ Tiempo: 3-5 días hábiles\n✅ Rastreo incluido\n✅ Empaque discreto\n\n¿Ya identificaste qué producto necesitas o quieres que te asesore?');
    this.responseCache.set('whatsapp', '📱 **WhatsApp: +57 312 2898771**\n\nPor WhatsApp puedes:\n✅ Completar tu pedido directo\n✅ Resolver dudas sobre tallas\n✅ Ver fotos reales de clientes\n✅ Recibir asesoría personalizada\n\n¿Prefieres que te recomiende un producto aquí primero antes de contactar por WhatsApp?');
    this.responseCache.set('probador virtual', '🌟 **Probador Virtual con Inteligencia Artificial**\n\nVentaja exclusiva de Esbelta:\n✅ Pruébate las fajas virtualmente ANTES de comprar\n✅ Sube tu foto y visualiza el resultado en segundos\n✅ Tecnología IA avanzada\n\n📍 Ubicación: Menú principal → "Probador Virtual"\n\n¿Te recomiendo un producto específico para que lo pruebes virtualmente?');
    this.responseCache.set('probar', '🌟 **Cómo usar el Probador Virtual:**\n\n1️⃣ Ve al menú principal\n2️⃣ Selecciona "Probador Virtual"\n3️⃣ Sube tu foto\n4️⃣ Elige el producto\n5️⃣ Visualiza el resultado\n\n¿Quieres que te recomiende qué faja probar según tu necesidad?');
  }

  checkCache(message) {
    const normalized = message.toLowerCase().trim();

    // Búsqueda exacta
    if (this.responseCache.has(normalized)) {
      return this.responseCache.get(normalized);
    }

    // Búsqueda parcial para saludos y despedidas
    for (const [key, value] of this.responseCache.entries()) {
      if (normalized.includes(key) && key.length > 3) {
        return value;
      }
    }

    return null;
  }

  async sendMessage(message, context = {}) {
    try {
      // Verificar caché primero para respuestas instantáneas
      const cachedResponse = this.checkCache(message);
      if (cachedResponse) {
        // Agregar al historial local para mantener contexto
        this.conversationHistory.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        });
        this.conversationHistory.push({
          role: 'assistant',
          content: cachedResponse,
          timestamp: new Date().toISOString()
        });
        return cachedResponse;
      }

      // Preparar contexto con información de productos
      const enrichedContext = {
        ...context,
        products: products.map(p => ({
          name: p.name,
          price: p.price,
          discount: p.discount,
          sizes: p.sizes,
          colors: p.colors,
          category: p.category
        }))
      };

      // Llamar al backend
      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: enrichedContext,
          sessionId: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.response;

      // Agregar al historial local
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });
      this.conversationHistory.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      });

      // Limitar el historial a las últimas 20 mensajes
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return responseText;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      // Manejo de errores
      if (error.message.includes('Failed to fetch')) {
        return 'Lo siento, no puedo conectarme al servidor en este momento. Por favor verifica tu conexión o contáctanos por WhatsApp al +57 312 2898771 😊';
      }

      return 'Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo? Mientras tanto, puedes contactarnos por WhatsApp al +57 312 2898771 😊';
    }
  }

  async getProductRecommendations(userPreferences) {
    const { usage, size, compressionLevel, budget } = userPreferences;

    const recommendationPrompt = `Basándote en el catálogo de productos disponibles, recomienda los más adecuados para:
- Uso: ${usage}
- Talla: ${size}
- Nivel de compresión: ${compressionLevel}
- Presupuesto: ${budget ? `$${budget} MXN` : 'No especificado'}

Proporciona 2-3 recomendaciones específicas del catálogo con nombres exactos, precios y razones breves.`;

    try {
      return await this.sendMessage(recommendationPrompt, {
        currentPage: 'recommendations'
      });
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      return null;
    }
  }

  async analyzeUserIntent(message) {
    const intentPrompt = `Analiza el siguiente mensaje y determina la intención del cliente.
Mensaje: "${message}"

Categorías posibles:
- CONSULTA_PRODUCTO: Preguntas sobre productos específicos
- AYUDA_TALLA: Necesita ayuda con tallas
- PRECIO_DESCUENTO: Pregunta sobre precios o descuentos
- COMPRA: Quiere comprar o agregar al carrito
- ENVIO: Preguntas sobre envío
- USO_DIARIO: Busca fajas para uso diario
- MODELADORA: Interesado en fajas moldeadoras
- CONTACTO: Quiere información de contacto
- GENERAL: Pregunta general o saludo

Responde SOLO con la categoría, sin ninguna explicación adicional.`;

    try {
      const response = await this.sendMessage(intentPrompt, {
        currentPage: 'intent_analysis'
      });
      return response.trim();
    } catch (error) {
      console.error('Error al analizar intención:', error);
      return 'GENERAL';
    }
  }

  async resetChat() {
    try {
      // Resetear en el backend
      await fetch(`${BACKEND_URL}/api/chat/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId
        })
      });

      // Resetear localmente
      this.conversationHistory = [];

      // Generar nuevo session ID
      this.sessionId = this.generateSessionId();
    } catch (error) {
      console.error('Error al resetear chat:', error);
      // Resetear localmente aunque falle el backend
      this.conversationHistory = [];
      this.sessionId = this.generateSessionId();
    }
  }
}

export default new OpenRouterService();
