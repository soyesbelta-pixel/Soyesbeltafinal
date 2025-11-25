import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BACKUP_DIR = path.join(__dirname, '..', 'backup-images');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const WEBP_QUALITY = 85; // Calidad WebP (0-100)
const MAX_WIDTH = 2000; // Ancho máximo para imágenes

// Estadísticas
let stats = {
  total: 0,
  optimized: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0
};

// Función para obtener tamaño de archivo
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

// Función para formatear bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Función para crear directorio si no existe
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para copiar archivo (backup)
async function backupFile(sourcePath, backupPath) {
  const backupDir = path.dirname(backupPath);
  ensureDir(backupDir);
  fs.copyFileSync(sourcePath, backupPath);
}

// Función para optimizar una imagen
async function optimizeImage(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    if (!IMAGE_EXTENSIONS.includes(ext)) {
      return;
    }

    stats.total++;

    // Obtener tamaño original
    const originalSize = getFileSize(imagePath);
    stats.originalSize += originalSize;

    console.log(`\n📸 Procesando: ${path.basename(imagePath)}`);
    console.log(`   Tamaño original: ${formatBytes(originalSize)}`);

    // Crear ruta de backup
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);

    // Hacer backup
    await backupFile(imagePath, backupPath);
    console.log(`   ✅ Backup creado`);

    // Optimizar imagen
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Redimensionar si es muy grande
    let pipeline = image;
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
      console.log(`   📐 Redimensionado de ${metadata.width}px a ${MAX_WIDTH}px`);
    }

    // Crear versión WebP
    const webpPath = imagePath.replace(ext, '.webp');
    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    const webpSize = getFileSize(webpPath);
    stats.optimizedSize += webpSize;

    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    console.log(`   ✅ WebP creado: ${formatBytes(webpSize)} (-${savings}%)`);

    // Opcional: Optimizar PNG/JPG original también
    await pipeline
      .toFile(imagePath + '.tmp');

    fs.renameSync(imagePath + '.tmp', imagePath);
    const newSize = getFileSize(imagePath);
    console.log(`   ✅ Original optimizado: ${formatBytes(newSize)}`);

    stats.optimized++;

  } catch (error) {
    stats.errors++;
    console.error(`   ❌ Error: ${error.message}`);
  }
}

// Función para recorrer directorios recursivamente
async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Ignorar directorios de backup y node_modules
    if (entry.name === 'backup-images' || entry.name === 'node_modules') {
      continue;
    }

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        await optimizeImage(fullPath);
      }
    }
  }
}

// Función principal
async function main() {
  console.log('\n🚀 Optimizador de Imágenes para Esbelta\n');
  console.log('═'.repeat(50));

  // Verificar que existe el directorio public
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('❌ Error: No se encontró el directorio /public');
    process.exit(1);
  }

  console.log(`📁 Directorio: ${PUBLIC_DIR}`);
  console.log(`💾 Backup: ${BACKUP_DIR}`);
  console.log(`🎨 Calidad WebP: ${WEBP_QUALITY}`);
  console.log(`📏 Ancho máximo: ${MAX_WIDTH}px`);
  console.log('═'.repeat(50));

  // Crear directorio de backup
  ensureDir(BACKUP_DIR);

  const startTime = Date.now();

  // Procesar todas las imágenes
  await processDirectory(PUBLIC_DIR);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Mostrar estadísticas finales
  console.log('\n' + '═'.repeat(50));
  console.log('📊 ESTADÍSTICAS FINALES\n');
  console.log(`✅ Total de imágenes: ${stats.total}`);
  console.log(`✅ Optimizadas: ${stats.optimized}`);
  console.log(`❌ Errores: ${stats.errors}`);
  console.log(`\n📦 Tamaño original: ${formatBytes(stats.originalSize)}`);
  console.log(`📦 Tamaño optimizado: ${formatBytes(stats.optimizedSize)}`);

  const totalSavings = stats.originalSize - stats.optimizedSize;
  const savingsPercent = ((totalSavings / stats.originalSize) * 100).toFixed(1);

  console.log(`\n💾 Ahorro total: ${formatBytes(totalSavings)} (${savingsPercent}%)`);
  console.log(`⏱️  Tiempo: ${duration}s`);
  console.log('═'.repeat(50));

  console.log('\n✨ ¡Optimización completada!\n');
  console.log('📌 Notas importantes:');
  console.log('   • Originales guardados en: backup-images/');
  console.log('   • Versiones WebP creadas con extensión .webp');
  console.log('   • Originales también optimizados (menor calidad)');
  console.log('   • Actualiza tus componentes para usar <picture> con WebP\n');
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
