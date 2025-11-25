#!/usr/bin/env node

/**
 * ==================================================================
 * SCRIPT DE CONVERSIÓN DE IMÁGENES A WEBP - ESBELTA
 * ==================================================================
 * Convierte PNG/JPG a WebP con 80% de calidad
 * Reducción esperada: 70-75% del tamaño original
 * ==================================================================
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para console.log
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.green}🖼️  Iniciando conversión de imágenes a WebP...${colors.reset}\n`);

// Configuración
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'webp');
const QUALITY = 80; // Calidad WebP (0-100)
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Contadores
let stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  originalSize: 0,
  compressedSize: 0
};

/**
 * Obtener tamaño de archivo en bytes
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Formatear bytes a MB
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convertir una imagen a WebP
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    // Obtener tamaño original
    const originalSize = await getFileSize(inputPath);

    // Convertir a WebP
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // Obtener tamaño comprimido
    const compressedSize = await getFileSize(outputPath);
    const reduction = ((1 - (compressedSize / originalSize)) * 100).toFixed(1);

    stats.originalSize += originalSize;
    stats.compressedSize += compressedSize;

    const filename = path.basename(inputPath);
    console.log(`${colors.yellow}🔄 ${filename}${colors.reset}`);
    console.log(`   Original: ${formatBytes(originalSize)}`);
    console.log(`   ${colors.green}WebP: ${formatBytes(compressedSize)} (-${reduction}%)${colors.reset}\n`);

    stats.success++;
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${inputPath}${colors.reset}`);
    console.error(`   ${error.message}\n`);
    stats.failed++;
    return false;
  }
}

/**
 * Procesar directorio recursivamente
 */
async function processDirectory(dir, baseDir = dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursivamente procesar subdirectorios
        // Excepto node_modules, .git, etc.
        if (!['node_modules', '.git', 'webp'].includes(entry.name)) {
          await processDirectory(fullPath, baseDir);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();

        if (EXTENSIONS.includes(ext)) {
          stats.total++;

          // Mantener estructura de directorios
          const relativePath = path.relative(baseDir, dir);
          const outputDirPath = path.join(OUTPUT_DIR, relativePath);
          const outputPath = path.join(
            outputDirPath,
            entry.name.replace(/\.(png|jpg|jpeg)$/i, '.webp')
          );

          // Crear directorio de salida si no existe
          await fs.mkdir(outputDirPath, { recursive: true });

          // Verificar si ya existe el archivo WebP
          const webpExists = await fs.access(outputPath).then(() => true).catch(() => false);

          if (webpExists) {
            console.log(`${colors.cyan}⏭️  Ya existe: ${entry.name} → ${path.basename(outputPath)}${colors.reset}`);
            stats.skipped++;
            continue;
          }

          // Convertir
          await convertToWebP(fullPath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error al procesar directorio ${dir}:${colors.reset}`, error.message);
  }
}

/**
 * Main
 */
async function main() {
  try {
    // Verificar si sharp está instalado
    try {
      await sharp({ create: { width: 1, height: 1, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .png()
        .toBuffer();
    } catch (error) {
      console.error(`${colors.red}❌ ERROR: sharp no está instalado${colors.reset}`);
      console.log(`${colors.yellow}Instala con: npm install sharp --save-dev${colors.reset}\n`);
      process.exit(1);
    }

    // Crear directorio de salida
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log(`${colors.yellow}📂 Directorio: ${PUBLIC_DIR}${colors.reset}`);
    console.log(`${colors.yellow}📁 Salida: ${OUTPUT_DIR}${colors.reset}\n`);

    // Procesar todos los archivos
    await processDirectory(PUBLIC_DIR);

    // Resumen
    console.log(`\n${colors.green}================================================${colors.reset}`);
    console.log(`${colors.green}📊 RESUMEN DE CONVERSIÓN${colors.reset}`);
    console.log(`${colors.green}================================================${colors.reset}`);
    console.log(`Total encontrados: ${stats.total}`);
    console.log(`${colors.green}Convertidos: ${stats.success}${colors.reset}`);
    console.log(`${colors.cyan}Ya existían: ${stats.skipped}${colors.reset}`);
    if (stats.failed > 0) {
      console.log(`${colors.red}Fallidos: ${stats.failed}${colors.reset}`);
    }

    // Ahorro total
    if (stats.success > 0) {
      const savedBytes = stats.originalSize - stats.compressedSize;
      const reductionTotal = ((savedBytes / stats.originalSize) * 100).toFixed(1);

      console.log(`\n${colors.yellow}💾 Ahorro de espacio:${colors.reset}`);
      console.log(`   Original: ${formatBytes(stats.originalSize)}`);
      console.log(`   Comprimido: ${formatBytes(stats.compressedSize)}`);
      console.log(`   ${colors.green}Ahorro: ${formatBytes(savedBytes)} (-${reductionTotal}%)${colors.reset}`);
    }

    console.log(`\n${colors.green}================================================${colors.reset}`);
    console.log(`${colors.yellow}📝 PRÓXIMOS PASOS:${colors.reset}`);
    console.log(`${colors.green}================================================${colors.reset}`);
    console.log(`1. Revisar las imágenes WebP en: ${OUTPUT_DIR}`);
    console.log(`2. Actualizar componentes para usar <picture> tags con fallback`);
    console.log(`3. Ejemplo:`);
    console.log(`${colors.cyan}   <picture>`);
    console.log(`     <source srcSet="imagen.webp" type="image/webp" />`);
    console.log(`     <img src="imagen.png" loading="lazy" />`);
    console.log(`   </picture>${colors.reset}`);
    console.log(`\n${colors.green}✨ ¡Conversión completada!${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}Error fatal:${colors.reset}`, error);
    process.exit(1);
  }
}

// Ejecutar
main();
