import { supabase } from './supabaseClient';

class ImageService {
  /**
   * Optimize image before upload (resize + convert to WebP)
   */
  async optimizeImage(file, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to optimize image'));
              }
            },
            'image/webp',
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload image to Supabase Storage
   */
  async uploadImage(file, path, optimize = true) {
    try {
      let uploadFile = file;

      // Optimize if enabled
      if (optimize) {
        console.log(`🖼️ Optimizing ${file.name}...`);
        uploadFile = await this.optimizeImage(file);
      }

      // Generate unique filename
      const fileExt = 'webp';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      console.log(`⬆️ Uploading to: ${filePath}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, uploadFile, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log(`✅ Upload complete: ${urlData.publicUrl}`);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images for a product color
   */
  async uploadProductImages(files, productName, colorName) {
    try {
      const sanitizedProductName = productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const sanitizedColorName = colorName.toLowerCase();
      const basePath = `products/${sanitizedProductName}/${sanitizedColorName}`;

      const uploadPromises = files.map((file) =>
        this.uploadImage(file, basePath, true)
      );

      const results = await Promise.all(uploadPromises);

      console.log(`✅ Uploaded ${results.length} images for ${productName} - ${colorName}`);

      return results.map(r => r.url);
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  /**
   * Delete image from Supabase Storage
   */
  async deleteImage(filePath) {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (error) throw error;

      console.log(`🗑️ Deleted: ${filePath}`);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Delete multiple images
   */
  async deleteImages(filePaths) {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove(filePaths);

      if (error) throw error;

      console.log(`🗑️ Deleted ${filePaths.length} images`);
      return true;
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  }

  /**
   * Get image URL from storage path
   */
  getImageUrl(path) {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Extract storage path from public URL
   */
  extractPathFromUrl(url) {
    if (!url) return null;

    // Extract path from Supabase public URL
    const match = url.match(/\/product-images\/(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Validate image file
   */
  validateImageFile(file, maxSizeMB = 5) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no válido. Solo se permiten: JPG, PNG, WEBP`);
    }

    if (file.size > maxSize) {
      throw new Error(`Archivo demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
    }

    return true;
  }

  /**
   * Batch validate multiple files
   */
  validateImageFiles(files, maxSizeMB = 5) {
    const errors = [];

    files.forEach((file, index) => {
      try {
        this.validateImageFile(file, maxSizeMB);
      } catch (error) {
        errors.push(`Imagen ${index + 1}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return true;
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload video to Supabase Storage
   */
  async uploadVideo(file, productName) {
    try {
      const sanitizedProductName = productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${sanitizedProductName}/${fileName}`;

      console.log(`⬆️ Uploading video: ${filePath}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-videos')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-videos')
        .getPublicUrl(filePath);

      console.log(`✅ Video upload complete: ${urlData.publicUrl}`);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  /**
   * Validate video file
   */
  validateVideoFile(file, maxSizeMB = 50) {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no válido. Solo se permiten: MP4, WEBM, OGG`);
    }

    if (file.size > maxSize) {
      throw new Error(`Video demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
    }

    return true;
  }

  /**
   * Delete video from Supabase Storage
   */
  async deleteVideo(filePath) {
    try {
      const { error } = await supabase.storage
        .from('product-videos')
        .remove([filePath]);

      if (error) throw error;

      console.log(`🗑️ Deleted video: ${filePath}`);
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}

export default new ImageService();
