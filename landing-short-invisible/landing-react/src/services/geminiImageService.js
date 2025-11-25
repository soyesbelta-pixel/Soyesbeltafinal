import { GoogleGenAI, Modality } from '@google/genai';

const fileToGenerativePart = (base64Data, mimeType) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

const generateTryOnImage = async (apiKey, base64Image, imageMimeType, product, view = 'front') => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash-image';
    const imagePart = fileToGenerativePart(base64Image, imageMimeType);

    const basePrompt = `Eres un AI experto en moda para la marca colombiana de fajas 'Esbelta'. Toma la imagen de la persona y vístela de manera realista con la siguiente faja: '${product.name}', que es '${product.description}'. La persona y la faja deben verse fotorealistas. El fondo debe ser un estudio profesional con fondo gris claro neutro. Superpón una marca de agua semi-transparente con el patrón 'esbelta' repetido sutilmente en todo el fondo. Mantén la etnia y características originales de la persona.`;

    let viewSpecifics;
    if (view === 'side') {
      viewSpecifics = `La imagen resultante debe ser una vista de perfil lateral de tres cuartos del cuerpo completo, elegantemente posada para mostrar mejor el efecto modelador y levantador de la prenda en los glúteos y caderas. No alteres drásticamente la forma del cuerpo o rostro de la persona, pero realza sutilmente la silueta para demostrar la efectividad del producto.`;
    } else {
      viewSpecifics = `La imagen resultante debe ser una vista frontal de cuerpo completo. No alteres drásticamente la forma del cuerpo o rostro de la persona, solo muestra cómo le queda la faja.`;
    }

    const prompt = `${basePrompt} ${viewSpecifics}`;

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Debug logging
    console.log('Gemini API Response:', JSON.stringify(response, null, 2));
    console.log('Response candidates:', response.candidates);

    if (!response.candidates || !response.candidates[0]) {
      throw new Error('La API de Gemini no devolvió candidatos. Respuesta: ' + JSON.stringify(response));
    }

    if (!response.candidates[0].content) {
      throw new Error('El candidato no tiene contenido. Respuesta: ' + JSON.stringify(response.candidates[0]));
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error generando vista ${view}:`, error);
    throw new Error(`Falló la generación de imagen ${view}.`);
  }
};

export const generateTryOnImages = async (apiKey, base64Image, imageMimeType, product) => {
  const [frontImage, sideImage] = await Promise.all([
    generateTryOnImage(apiKey, base64Image, imageMimeType, product, 'front'),
    generateTryOnImage(apiKey, base64Image, imageMimeType, product, 'side'),
  ]);

  return { front: frontImage, side: sideImage };
};
