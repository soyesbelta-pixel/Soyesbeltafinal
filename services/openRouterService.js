import OpenAI from 'openai';

class OpenRouterService {
  constructor(apiKey) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://esbelta.com',
        'X-Title': 'Esbelta - Fajas Colombianas Premium',
      }
    });

    this.conversationHistory = new Map(); // sessionId -> messages[]
    this.responseCache = new Map();
    this.initializeCache();
  }

  initializeCache() {
    // Cachear respuestas comunes para respuestas instantáneas
    this.responseCache.set('hola', '¡Hola! 👋 Soy Alexa, tu asesora personal. ¿En qué puedo ayudarte hoy? Puedo recomendarte la faja perfecta según tus necesidades 💖');
    this.responseCache.set('buenos dias', '¡Buenos días! 🌞 Soy Alexa. ¿Buscas una faja específica o necesitas ayuda para elegir? Estoy aquí para ayudarte 💖');
    this.responseCache.set('buenas tardes', '¡Buenas tardes! 🌸 Soy Alexa. ¿En qué puedo asistirte hoy? Tenemos fajas increíbles con descuentos especiales 💖');
    this.responseCache.set('buenas noches', '¡Buenas noches! 🌙 Soy Alexa. ¿Necesitas ayuda para encontrar la faja ideal? Con gusto te asesoro 💖');
    this.responseCache.set('gracias', '¡Con mucho gusto! 😊 Si necesitas algo más, aquí estoy. También puedes contactarnos por WhatsApp al +52 55 5961 1567 💬');
    this.responseCache.set('adios', '¡Hasta pronto! 👋 Fue un placer ayudarte. Recuerda que puedes volver cuando quieras o contactarnos por WhatsApp 💖');
    this.responseCache.set('precio', 'Nuestros precios van desde **$75,000 hasta $165,000 MXN** con descuentos del 25% al 40%. ¿Te interesa algún producto en particular? 💰');
    this.responseCache.set('envio', 'Hacemos **envíos a todo el país** 📦 y tenemos **envío GRATIS en compras mayores a $150,000**. ¿Ya sabes qué producto te interesa? 🚚');
    this.responseCache.set('whatsapp', 'Puedes contactarnos por WhatsApp al **+52 55 5961 1567** 📱 para atención personalizada inmediata 💬');
    this.responseCache.set('probador virtual', '🌟 ¡Nuestro **Probador Virtual** es único! Usa tecnología IA para probarte las fajas virtualmente antes de comprar. Encuéntralo en el **menú principal** → "Probador Virtual". ¡Es súper fácil y te ayuda a ver cómo te quedaría! 💖');
    this.responseCache.set('probar', '🌟 ¡Tenemos un **Probador Virtual** increíble! Puedes ver cómo te quedaría la faja antes de comprar. Ve al **menú principal** y selecciona "Probador Virtual" 💖');
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

  getSystemPrompt(products) {
    return `Eres Alexa, asesora de Esbelta - Fajas Colombianas Premium. Personalidad cálida, profesional y colombiana.

TIENDA: Esbelta | WhatsApp: +52 55 5961 1567 | Envíos nacionales

PRODUCTOS: ${products.map(p => `${p.name}: $${p.price.toLocaleString()} (-${p.discount}%) | Tallas: ${p.sizes.join(',')} | Colores: ${p.colors.join('/')} | ${p.category}`).join(' | ')}

🌟 PROBADOR VIRTUAL (DIFERENCIAL ÚNICO): Tecnología IA para probarse fajas virtualmente antes de comprar. Ubicación: Menú principal → "Probador Virtual"

REGLAS:
1. Tono amigable colombiano, emojis moderados 💖
2. Recomienda productos según necesidades
3. Menciona descuentos actuales
4. Respuestas concisas (máx 100 palabras)
5. Usa negritas **importantes**
6. Sugiere WhatsApp para detalles específicos
7. Si no hay info → contactar WhatsApp
8. 🎯 IMPORTANTE: Menciona el **Probador Virtual** como nuestro diferencial único e invita a usarlo desde el menú

Responde directo, sin preámbulos.`;
  }

  buildMessages(sessionId, products) {
    const messages = [
      {
        role: 'system',
        content: this.getSystemPrompt(products)
      }
    ];

    // Agregar historial de conversación si existe
    const history = this.conversationHistory.get(sessionId) || [];
    for (const msg of history) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    return messages;
  }

  async sendMessage(sessionId, message, context = {}) {
    try {
      // Verificar caché primero para respuestas instantáneas
      const cachedResponse = this.checkCache(message);
      if (cachedResponse) {
        // Agregar al historial para mantener contexto
        this.addToHistory(sessionId, 'user', message);
        this.addToHistory(sessionId, 'assistant', cachedResponse);
        return cachedResponse;
      }

      // Agregar mensaje del usuario al historial
      this.addToHistory(sessionId, 'user', message);

      // Construir mensajes con contexto
      const messages = this.buildMessages(sessionId, context.products || []);

      // Agregar contexto adicional al último mensaje del usuario
      let enrichedUserMessage = message;
      if (context.currentPage) {
        enrichedUserMessage += `\n[Contexto: El cliente está viendo ${context.currentPage}]`;
      }
      if (context.cartItems && context.cartItems.length > 0) {
        enrichedUserMessage += `\n[Carrito actual: ${context.cartItems.map(item => `${item.name} (${item.size})`).join(', ')}]`;
      }

      // Actualizar el último mensaje con contexto
      if (messages.length > 1) {
        messages[messages.length - 1].content = enrichedUserMessage;
      }

      // Llamar a OpenRouter API
      const completion = await this.client.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-09-2025',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3
      });

      const responseText = completion.choices[0].message.content;

      // Agregar respuesta al historial
      this.addToHistory(sessionId, 'assistant', responseText);

      return responseText;
    } catch (error) {
      console.error('Error al enviar mensaje a OpenRouter:', error);

      // Manejo de errores específicos
      if (error.status === 429) {
        return 'Perdón, estamos recibiendo muchas consultas. Por favor intenta de nuevo en unos segundos o contáctanos por WhatsApp al +52 55 5961 1567 💬';
      }

      if (error.status === 401) {
        return 'Lo siento, hay un problema con mi configuración. Por favor contacta a soporte técnico o escríbenos por WhatsApp 📱';
      }

      return 'Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo? Mientras tanto, puedes contactarnos por WhatsApp al +52 55 5961 1567 😊';
    }
  }

  addToHistory(sessionId, role, content) {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }

    const history = this.conversationHistory.get(sessionId);
    history.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Limitar el historial a las últimas 20 mensajes (10 interacciones)
    if (history.length > 20) {
      this.conversationHistory.set(sessionId, history.slice(-20));
    }
  }

  resetChat(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

export default OpenRouterService;
