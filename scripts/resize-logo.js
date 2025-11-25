import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function resizeLogos() {
  const logoPath = join(projectRoot, 'Logo.png');
  const publicDir = join(projectRoot, 'public');

  try {
    // 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(join(publicDir, 'icon-192.png'));
    console.log('✓ Created icon-192.png');

    // 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(join(publicDir, 'icon-512.png'));
    console.log('✓ Created icon-512.png');

    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

resizeLogos();
