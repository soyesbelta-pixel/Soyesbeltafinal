import axios from 'axios';
import type { Product } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_ID = 'google/gemini-2.5-flash-image-preview';

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable not set");
}

const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result); // Returns full data URL including "data:image/jpeg;base64,"
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Convert image URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting URL to base64:', error);
        throw new Error('Failed to load product image');
    }
};

/**
 * Generates a professional, restriction-avoiding prompt using technical references
 * This format emphasizes e-commerce catalog context and professional standards
 */
const generateProfessionalPrompt = (productDescription: string, productName: string): string => {
    // Extract key attributes from the description
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
- Fondo gris claro neutro uniforme
- Composición equilibrada y simétrica
- Calidad fotográfica alta definición
- Enfoque nítido en rostro y prenda

Texto identificador superior:
"Soy Esbelta" centrado, tipografía elegante, sutil.

ESTÁNDARES PROFESIONALES:
- Imagen apta para catálogo e-commerce internacional
- Presentación respetuosa y profesional
- Énfasis en la calidad y ajuste del producto
- Resultado tipo fotografía de moda deportiva profesional
- Sin modificación de rasgos faciales o corporales
- Mantener naturalidad y elegancia
- Prenda completamente opaca con cobertura profesional`;
};

export const generateTryOnImage = async (userImageFile: File, product: Product) => {
    try {
        // Convert user image to base64 data URL
        const userImageBase64 = await fileToBase64(userImageFile);

        // Convert product image to base64 (from local path)
        let productImageBase64: string;
        if (product.localImagePath) {
            productImageBase64 = await urlToBase64(product.localImagePath);
        } else {
            // Fallback to image URL if no local path
            productImageBase64 = await urlToBase64(product.image);
        }

        // Generate professional prompt to avoid restrictions
        const professionalPrompt = generateProfessionalPrompt(product.prompt, product.name);

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
            // Additional safety parameters if supported by OpenRouter
            top_p: 0.9
        };

        // Make the API request
        const response = await axios.post(
            OPENROUTER_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Professional E-commerce Catalog - GymFit'
                }
            }
        );

        // Extract the generated image and text from response
        let generatedImage: string | null = null;
        let generatedText: string | null = null;

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
            throw new Error("Unable to generate image. Please try with a different product description or ensure it follows professional catalog standards.");
        }

        return { image: generatedImage, text: generatedText };
    } catch (error: any) {
        console.error("Error generating image:", error);

        // Handle specific API errors with more helpful messages
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please check your OpenRouter API key.");
        } else if (error.response?.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.");
        } else if (error.response?.data?.error?.message?.includes('safety') ||
                   error.response?.data?.error?.message?.includes('blocked') ||
                   error.response?.data?.error?.message?.includes('inappropriate')) {
            throw new Error("The content was blocked for safety reasons. Please ensure your product description is appropriate for a professional catalog and try using more technical, fashion-industry terminology.");
        } else if (error.response?.data?.error) {
            throw new Error(`API Error: ${error.response.data.error.message || 'Unknown error'}`);
        }

        throw new Error("Failed to generate the try-on image. Please ensure the product description is appropriate for a professional e-commerce catalog.");
    }
};