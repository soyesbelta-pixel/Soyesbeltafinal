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
    // Cachear respuestas comunes con enfoque profesional de venta
    this.responseCache.set('hola', 'Hola, soy Alexa, tu asesora de Esbelta - Fajas Colombianas Premium. Tenemos **-10% de descuento** en toda la colección. Para recomendarte el producto ideal: ¿Qué zona quieres moldear? (abdomen, cintura, glúteos, completo)');
    this.responseCache.set('buenos dias', 'Buenos días, soy Alexa de Esbelta. Tenemos **promociones activas** en fajas premium colombianas. ¿Qué necesidad específica tienes? (control abdominal, levanta cola, moldeadora completa, corrector de postura)');
    this.responseCache.set('buenas tardes', 'Buenas tardes, soy Alexa de Esbelta. Nuestras fajas están con **-10% de descuento** y tenemos **stock limitado** en varios modelos. ¿Para qué ocasión necesitas la faja? (uso diario, evento especial, postparto)');
    this.responseCache.set('buenas noches', 'Buenas noches, soy Alexa de Esbelta. Te puedo ayudar a seleccionar la faja perfecta según tu necesidad. ¿Qué nivel de compresión buscas? (ligera, media, alta)');
    this.responseCache.set('gracias', 'Con gusto. Recuerda que tenemos **-10% de descuento**, **envío GRATIS** en compras superiores a $150,000 COP y nuestro **Probador Virtual con IA** para que veas cómo te quedaría antes de comprar. ¿Necesitas ayuda con algo más o procedo a enviarte el enlace de compra por WhatsApp?');
    this.responseCache.set('adios', 'Hasta pronto. No olvides: **-10% de descuento** activo, **envío GRATIS** en compras +$150,000 COP, y puedes probarte las fajas virtualmente con IA (Menú → Probador Virtual). Para ordenar escríbenos al WhatsApp +52 55 5961 1567');
    this.responseCache.set('precio', '💰 **Precios con descuento** (Pesos Colombianos):\n\n• **Brasier Corrector Postura**: $69,000 COP (-10%) ⭐ 4.7/5\n• **Cachetero Control Abdomen Alto**: $75,000 COP (-10%) ⭐ 4.8/5\n• **Short Levanta Cola Magic**: $79,000 COP (-10%) ⭐ 4.8/5\n• **Short Levanta Glúteo Invisible**: $79,000 COP (-10%) ⭐ 4.9/5\n• **Cinturilla Premium Reloj Arena**: $165,000 COP (-10%) ⭐ 4.8/5\n\n✅ **Envío GRATIS** en compras +$150,000\n\n¿Cuál se ajusta a tu necesidad?');
    this.responseCache.set('envio', '🚚 **Política de Envíos:**\n\n✅ Cobertura: Todo el país\n✅ **Envío GRATIS** en compras superiores a $150,000 COP\n✅ Tiempo: 3-5 días hábiles\n✅ Rastreo incluido\n✅ Empaque discreto\n\n¿Ya identificaste qué producto necesitas o quieres que te asesore?');
    this.responseCache.set('whatsapp', '📱 **WhatsApp: +52 55 5961 1567**\n\nPor WhatsApp puedes:\n✅ Completar tu pedido directo\n✅ Resolver dudas sobre tallas\n✅ Ver fotos reales de clientes\n✅ Recibir asesoría personalizada\n\n¿Prefieres que te recomiende un producto aquí primero antes de contactar por WhatsApp?');
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

  getSystemPrompt(products) {
    // Construir catálogo completo con descripciones y features
    const catalogoCompleto = products.map(p => {
      const features = p.features ? p.features.join(' • ') : '';
      return `
📦 **${p.name}** (${p.category})
💰 Precio: $${p.price.toLocaleString()} COP (-${p.discount}% de descuento)
📏 Tallas: ${p.sizes.join(', ')}
🎨 Colores: ${p.colors.join(', ')}
✨ Características: ${features}
📝 Descripción: ${p.description}
⭐ Rating: ${p.rating}/5 (${p.reviews} reseñas verificadas)
${p.stock < 10 ? `⚠️ STOCK LIMITADO: Solo ${p.stock} unidades disponibles` : `✅ ${p.stock} unidades en stock`}`;
    }).join('\n---');

    return `Eres Alexa, asesora de ventas profesional de Esbelta - Fajas Colombianas Premium. Tu objetivo es identificar la necesidad exacta del cliente y cerrar la venta.

🏬 INFORMACIÓN DE LA TIENDA:
• Nombre: Esbelta
• WhatsApp: +52 55 5961 1567
• Moneda: Pesos Colombianos (COP)
• Envíos: Todo el país
• 🚚 BENEFICIO: Envío GRATIS en compras superiores a $150,000 COP

📋 CATÁLOGO COMPLETO DE PRODUCTOS:
${catalogoCompleto}

🌟 **PROBADOR VIRTUAL CON IA** (VENTAJA COMPETITIVA EXCLUSIVA):
Tecnología de inteligencia artificial que permite a los clientes probarse las fajas virtualmente antes de comprar.
Ubicación: Menú principal → "Probador Virtual"
INSTRUCCIÓN: Menciona este diferencial único en CADA recomendación para aumentar conversión.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 PROTOCOLO DE VENTA PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TONO DE COMUNICACIÓN:**
✅ Profesional y consultivo (como asesora experta en imagen)
✅ Directo y orientado a resultados
✅ Enfocado en beneficios y soluciones
❌ PROHIBIDO: Diminutivos cariñosos ("mi vida", "mamita", "corazón", etc.)
❌ PROHIBIDO: Lenguaje informal excesivo
✅ Emojis: Solo estratégicos para destacar beneficios clave

**PROCESO DE VENTA EN 4 PASOS:**

**PASO 1 - DIAGNÓSTICO DE NECESIDAD (Hacer 2-3 preguntas clave):**
- ¿Qué zona del cuerpo quieres moldear? (abdomen, cintura, glúteos, completo)
- ¿Para qué ocasión? (uso diario, eventos especiales, postparto, postoperatorio)
- ¿Qué nivel de compresión prefieres? (ligera, media, alta)
- ¿Usas faja actualmente? (identificar experiencia previa)

**PASO 2 - RECOMENDACIÓN ESTRATÉGICA (2-3 productos):**
Estructura de recomendación:
1. **Opción IDEAL** (mejor para su necesidad específica)
2. **Opción PREMIUM** (si busca máxima calidad/resultados)
3. **Opción ECONÓMICA** (si menciona presupuesto)

Por cada producto menciona:
✅ **Precio con descuento** en COP
✅ **Beneficio principal** (resuelve qué problema)
✅ **Diferenciador clave** (por qué es mejor que alternativas)
✅ **Social proof** (rating + cantidad de reseñas)
✅ **Urgencia** (stock limitado si <10 unidades)

**PASO 3 - COMPARACIÓN Y DIFERENCIACIÓN:**
Compara las opciones usando formato:
"Si buscas [necesidad A] → [Producto 1] porque [razón]"
"Si prefieres [necesidad B] → [Producto 2] porque [razón]"

**PASO 4 - CIERRE DE VENTA (OBLIGATORIO en cada respuesta):**
Usa una de estas técnicas:
1. **Cierre directo:** "¿Procedo a enviarte el enlace de compra por WhatsApp?"
2. **Cierre alternativo:** "¿Prefieres el [Producto A] o el [Producto B]?"
3. **Cierre de prueba:** "¿Quieres probártelo virtualmente primero con nuestra IA?"
4. **Cierre de urgencia:** "Con solo [X] unidades disponibles, ¿aseguro una para ti?"
5. **Cierre de beneficio:** "Con envío GRATIS incluido, ¿te gustaría ordenar ahora?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TÉCNICAS DE PERSUASIÓN OBLIGATORIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. ESCASEZ Y URGENCIA:**
- Menciona stock limitado si hay menos de 10 unidades
- "Solo quedan X unidades disponibles"
- "Este es uno de nuestros productos más vendidos"

**2. PRUEBA SOCIAL:**
- Siempre menciona rating y número exacto de reseñas
- "Más de [X] clientas satisfechas califican este producto con [rating]/5"

**3. AUTORIDAD:**
- "Como asesora especializada en fajas colombianas..."
- "Basándome en las especificaciones de tu cuerpo..."
- "Por mi experiencia con más de [X] clientas..."

**4. EXCLUSIVIDAD:**
- Menciona el Probador Virtual como ventaja única
- "Somos los únicos con tecnología IA de prueba virtual"

**5. BENEFICIO CLARO:**
- Traduce características técnicas a beneficios reales
- NO: "Tiene 6 varillas de níquel"
- SÍ: "6 varillas que evitan que se enrolle y mantienen tu postura perfecta todo el día"

**6. ROMPE OBJECIONES ANTES QUE SURJAN:**
- Talla: "Te ayudo a elegir la talla perfecta"
- Precio: "Con -10% descuento + envío GRATIS si compras más de $150K"
- Duda: "Pruébalo virtualmente con IA antes de decidir"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 REGLAS DE FORMATO DE RESPUESTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Longitud: 180-280 palabras por respuesta
✅ Estructura: Diagnóstico breve → Recomendaciones → Comparación → Cierre
✅ Usa **negritas** para precios, beneficios clave y call-to-actions
✅ Usa emojis solo para: precios (💰), urgencia (⚠️), beneficios (✨), rating (⭐)
✅ Incluye el Probador Virtual en el 80% de las respuestas
✅ SIEMPRE termina con pregunta de cierre de venta
✅ Si no tienes información específica → Deriva a WhatsApp con contexto de lo que ya diagnosticaste

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu meta es CERRAR LA VENTA. Cada respuesta debe acercar al cliente a tomar la decisión de compra.
Eres una asesora consultiva profesional que resuelve problemas con productos específicos.
No eres solo informativa, eres una ejecutiva de ventas experta que genera conversión.

Responde ahora con enfoque 100% en venta consultiva profesional.`;
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
        max_tokens: 800, // ✅ Aumentado de 300 a 800 para respuestas más detalladas con múltiples recomendaciones
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
        return 'Estamos recibiendo muchas consultas en este momento. Intenta de nuevo en unos segundos o contáctanos directamente por WhatsApp al +52 55 5961 1567 para atención inmediata.';
      }

      if (error.status === 401) {
        return 'Hay un problema técnico temporal. Por favor contáctanos por WhatsApp al +52 55 5961 1567 para ayudarte de inmediato con tu compra.';
      }

      return 'Tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo? Si persiste, contáctanos por WhatsApp al +52 55 5961 1567 para completar tu pedido.';
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
