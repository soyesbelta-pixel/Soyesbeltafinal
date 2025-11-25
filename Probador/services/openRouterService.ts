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

export const generateTryOnImage = async (userImageFile: File, product: Product) => {
    try {
        // Convert image to base64 data URL
        const base64Image = await fileToBase64(userImageFile);

        // Prepare the request payload
        const payload = {
            model: MODEL_ID,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Please edit the image of the person to show them wearing ${product.prompt}. The new clothing should realistically conform to their body and pose. Maintain the original background. Generate a realistic image showing this change.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image
                            }
                        }
                    ]
                }
            ],
            modalities: ["image", "text"],
            temperature: 0.7,
            max_tokens: 8192
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
                    'X-Title': 'GymFit Virtual Try-On'
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
            throw new Error("API did not return an image. Please try again.");
        }

        return { image: generatedImage, text: generatedText };
    } catch (error: any) {
        console.error("Error generating image:", error);

        // Handle specific API errors
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please check your OpenRouter API key.");
        } else if (error.response?.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.");
        } else if (error.response?.data?.error) {
            throw new Error(`API Error: ${error.response.data.error.message || 'Unknown error'}`);
        }

        throw new Error("Failed to generate the try-on image. Please try again.");
    }
};