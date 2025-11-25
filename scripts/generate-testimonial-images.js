import fs from "fs";
import path from "path";

// Configuración
const API_KEY = "AIzaSyCxXaym91rwecKTwiM_0-rE0pjC9OwmIxs"; 
const OUTPUT_DIR = path.join(process.cwd(), "public");

const PROMPTS = [
  {
    filename: "cliente1-real.jpg",
    prompt: "Selfie mirror photo of a latina woman in her 30s wearing a waist trainer under a tight black t-shirt, showing an hourglass figure, bathroom background, realistic lighting, high quality, photorealistic, 8k."
  },
  {
    filename: "cliente2-real.jpg",
    prompt: "Full body photo of a young latina woman smiling confidently wearing a body shaper under a casual summer dress, urban street background, sunlight, natural look, high quality, photorealistic, 8k."
  },
  {
    filename: "cliente3-real.jpg",
    prompt: "Photo of a fit latina woman in a gym setting wearing activewear and a sports waist trainer, holding a water bottle, looking at camera, gym background, realistic fitness style, high quality, photorealistic, 8k."
  },
  {
    filename: "cliente4-real.jpg",
    prompt: "Photo of a woman from behind or side profile wearing jeans and a white top, highlighting curves and butt lift effect, outdoor park background, sunny day, casual style, high quality, photorealistic, 8k."
  }
];

async function generateImages() {
  console.log("🚀 Iniciando generación con models/gemini-2.5-flash-image...");
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const item of PROMPTS) {
    console.log(`📸 Generando: ${item.filename}...`);
    try {
      // Usando EL MODELO EXACTO que solicitaste
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:predict?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [
              { prompt: item.prompt }
            ],
            parameters: {
              aspectRatio: "1:1",
              sampleCount: 1
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error API (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      // La estructura de respuesta puede variar, verificamos predicciones
      if (data.predictions && data.predictions[0]) {
        let base64Image = data.predictions[0].bytesBase64Encoded || data.predictions[0];
        
        if (base64Image) {
            const buffer = Buffer.from(base64Image, "base64");
            const filePath = path.join(OUTPUT_DIR, item.filename);
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Guardada: ${filePath}`);
        } else {
             console.error("❌ Estructura de respuesta desconocida:", JSON.stringify(data).substring(0, 200));
        }
      } else {
        console.error("❌ No se recibieron datos:", JSON.stringify(data).substring(0, 200));
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

generateImages();
