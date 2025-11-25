import { GoogleGenAI, Modality } from "@google/genai";
import { Product } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

const generateTryOnImage = async (
  base64Image: string,
  imageMimeType: string,
  product: Product,
  view: 'front' | 'side'
): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const imagePart = fileToGenerativePart(base64Image, imageMimeType);
    
    const basePrompt = `You are an expert fashion AI stylist for the Colombian shapewear brand 'soyesbelta'. Take the uploaded image of the person and realistically dress them in the following shapewear: '${product.name}', which is a '${product.description}'. The person and the shapewear should look photorealistic. The background must be a professional, neutral light-grey studio background. Superimpose a subtle, semi-transparent, repeating 'soyesbelta' watermark pattern across the entire background. Maintain the original person's ethnicity and features.`;

    let viewSpecifics: string;
    if (view === 'side') {
      viewSpecifics = `The resulting image should be a full-body, three-quarter side profile view, elegantly posed to best showcase the garment's shaping and lifting effect on the glutes and hips. Do not drastically alter the person's body shape or face, but subtly enhance the silhouette to demonstrate the product's effectiveness.`;
    } else { // front view
      viewSpecifics = `The resulting image should be a full-body, front-facing view. Do not drastically alter the person's body shape or face, only show how the shapewear fits on them.`;
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

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error generating ${view} view:`, error);
    throw new Error(`Failed to generate ${view} view image.`);
  }
};


export const generateTryOnImages = async (
  base64Image: string,
  imageMimeType: string,
  product: Product
) => {
  const [frontImage, sideImage] = await Promise.all([
    generateTryOnImage(base64Image, imageMimeType, product, 'front'),
    generateTryOnImage(base64Image, imageMimeType, product, 'side'),
  ]);

  return { front: frontImage, side: sideImage };
};