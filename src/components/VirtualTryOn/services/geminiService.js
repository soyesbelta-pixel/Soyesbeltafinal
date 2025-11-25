// API del backend
// En desarrollo: http://localhost:3001
// En producción (Vercel): '' (rutas relativas /api/*)
const BACKEND_URL = import.meta.env.MODE === 'production'
  ? ''
  : 'http://localhost:3001';

const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            resolve(result); // Returns full data URL including "data:image/jpeg;base64,"
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Convert image URL to base64
const urlToBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        throw new Error('Failed to load product image');
    }
};

// This function is no longer needed - the backend handles prompt generation

export const generateTryOnImage = async (userImageFile, product) => {
    try {
        // Convert user image to base64 data URL
        const userImageBase64 = await fileToBase64(userImageFile);

        // Convert product image to base64 (from local path)
        let productImageBase64;
        if (product.localImagePath) {
            productImageBase64 = await urlToBase64(product.localImagePath);
        } else {
            // Fallback to image URL if no local path
            productImageBase64 = await urlToBase64(product.image);
        }

        // Call backend API
        const response = await fetch(`${BACKEND_URL}/api/virtual-tryon/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userImageBase64,
                productImageBase64,
                product: {
                    name: product.name,
                    prompt: product.prompt,
                    description: product.description
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al generar la imagen');
        }

        const data = await response.json();

        if (!data.image) {
            throw new Error("No se pudo generar la imagen. Por favor intenta con una descripción de producto diferente o asegúrate de que sigue los estándares profesionales del catálogo.");
        }

        return { image: data.image, text: data.text };
    } catch (error) {
        // Handle specific errors
        if (error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor. Por favor verifica tu conexión.');
        }

        throw new Error(error.message || "Falló la generación de la imagen de prueba virtual. Por favor intenta de nuevo.");
    }
};