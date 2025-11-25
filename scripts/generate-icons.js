import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const imageBuffer = readFileSync(join(__dirname, '../public/icon-source.jpg'));

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 256, name: 'icon-256.png' },
  { size: 1024, name: 'icon.png' }, // Base icon
];

async function generateIcons() {
  for (const { size, name } of sizes) {
    await sharp(imageBuffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(__dirname, '../public', name));
    console.log(`✅ Generated ${name}`);
  }
  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);