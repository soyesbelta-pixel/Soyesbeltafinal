import { supabase } from './supabaseClient';
import { products as staticProducts } from '../data/products';

// Feature flag - toggle to enable/disable Supabase backend
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true' || false;

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

class ProductService {
  constructor() {
    this.cache = new CacheService();
    this.useSupabase = USE_SUPABASE;
  }

  /**
   * Get all products with optional filtering
   */
  async getProducts(filters = {}) {
    const cacheKey = `products_${JSON.stringify(filters)}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      console.log('📦 Returning cached products');
      return cached;
    }

    try {
      if (this.useSupabase) {
        const products = await this._getProductsFromSupabase(filters);
        this.cache.set(cacheKey, products);
        return products;
      }
    } catch (error) {
      console.warn('⚠️ Supabase fetch failed, falling back to static data:', error);
    }

    // Fallback to static products
    const filteredProducts = this._filterStaticProducts(staticProducts, filters);
    this.cache.set(cacheKey, filteredProducts);
    return filteredProducts;
  }

  /**
   * Get single product by ID
   */
  async getProduct(productId) {
    const cacheKey = `product_${productId}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      if (this.useSupabase) {
        const product = await this._getProductFromSupabase(productId);
        this.cache.set(cacheKey, product);
        return product;
      }
    } catch (error) {
      console.warn('⚠️ Supabase fetch failed, falling back to static data:', error);
    }

    // Fallback to static products
    const product = staticProducts.find(p => p.id === productId);
    if (product) {
      this.cache.set(cacheKey, product);
    }
    return product;
  }

  /**
   * Create new product (Admin only)
   */
  async createProduct(productData, images = {}) {
    if (!this.useSupabase) {
      throw new Error('Product creation requires Supabase to be enabled');
    }

    try {
      // Insert main product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          category: productData.category,
          description: productData.description,
          price: productData.price,
          rating: productData.rating || 4.8,
          reviews: productData.reviews || 0,
          stock: productData.stock || 0,
          is_active: productData.is_active !== false,
          is_hot: productData.is_hot || false,
          is_new: productData.is_new || false,
          video_url: productData.video_url || null,
          main_image: productData.main_image || null
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert features
      if (productData.features && productData.features.length > 0) {
        const features = productData.features.map((feature, index) => ({
          product_id: product.id,
          feature_text: feature,
          display_order: index
        }));

        const { error: featuresError } = await supabase
          .from('product_features')
          .insert(features);

        if (featuresError) throw featuresError;
      }

      // Insert sizes
      if (productData.sizes && productData.sizes.length > 0) {
        const sizes = productData.sizes.map((size, index) => ({
          product_id: product.id,
          size: size,
          stock: productData.stock || 0,
          is_available: true,
          display_order: index
        }));

        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(sizes);

        if (sizesError) throw sizesError;
      }

      // Insert colors and images
      if (productData.colors && productData.colors.length > 0) {
        for (let i = 0; i < productData.colors.length; i++) {
          const color = productData.colors[i];

          // Insert color
          const { data: colorData, error: colorError } = await supabase
            .from('product_colors')
            .insert({
              product_id: product.id,
              color_name: color,
              display_order: i
            })
            .select()
            .single();

          if (colorError) throw colorError;

          // Insert images for this color
          const colorImages = images[color.toLowerCase()] || [];
          if (colorImages.length > 0) {
            const imageRecords = colorImages.map((imageUrl, index) => ({
              product_id: product.id,
              color_id: colorData.id,
              image_url: imageUrl,
              display_order: index,
              is_primary: i === 0 && index === 0
            }));

            const { error: imagesError } = await supabase
              .from('product_images')
              .insert(imageRecords);

            if (imagesError) throw imagesError;
          }
        }
      }

      // Log audit trail
      await this._logAudit(product.id, 'CREATE', { product: productData });

      // Clear cache
      this.cache.clear();

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update existing product (Admin only)
   */
  async updateProduct(productId, updates, newImages = null) {
    if (!this.useSupabase) {
      throw new Error('Product updates require Supabase to be enabled');
    }

    try {
      // Extract only valid product fields (exclude features, sizes, colors)
      const { features, sizes, colors, ...productUpdates } = updates;

      // Build update object with only defined values
      const updateData = {};
      if (productUpdates.name !== undefined) updateData.name = productUpdates.name;
      if (productUpdates.category !== undefined) updateData.category = productUpdates.category;
      if (productUpdates.description !== undefined) updateData.description = productUpdates.description;
      if (productUpdates.price !== undefined) updateData.price = productUpdates.price;
      if (productUpdates.rating !== undefined) updateData.rating = productUpdates.rating;
      if (productUpdates.reviews !== undefined) updateData.reviews = productUpdates.reviews;
      if (productUpdates.stock !== undefined) updateData.stock = productUpdates.stock;
      if (productUpdates.is_hot !== undefined) updateData.is_hot = productUpdates.is_hot;
      if (productUpdates.is_new !== undefined) updateData.is_new = productUpdates.is_new;
      if (productUpdates.video_url !== undefined) updateData.video_url = productUpdates.video_url;
      if (productUpdates.main_image !== undefined) updateData.main_image = productUpdates.main_image;

      updateData.updated_at = new Date().toISOString();

      // Update main product with valid fields only
      const { data: product, error: productError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (productError) throw productError;

      // Update features if provided
      if (updates.features) {
        // Delete existing features
        await supabase.from('product_features').delete().eq('product_id', productId);

        // Insert new features
        const features = updates.features.map((feature, index) => ({
          product_id: productId,
          feature_text: feature,
          display_order: index
        }));

        await supabase.from('product_features').insert(features);
      }

      // Update sizes if provided
      if (updates.sizes) {
        // Delete existing sizes
        await supabase.from('product_sizes').delete().eq('product_id', productId);

        // Insert new sizes
        const sizes = updates.sizes.map((size, index) => ({
          product_id: productId,
          size: size,
          stock: updates.stock || 0,
          is_available: true,
          display_order: index
        }));

        await supabase.from('product_sizes').insert(sizes);
      }

      // Update images if provided
      if (newImages) {
        // Delete existing images and colors
        await supabase.from('product_images').delete().eq('product_id', productId);
        await supabase.from('product_colors').delete().eq('product_id', productId);

        // Insert new colors and images
        if (updates.colors) {
          for (let i = 0; i < updates.colors.length; i++) {
            const color = updates.colors[i];

            const { data: colorData } = await supabase
              .from('product_colors')
              .insert({
                product_id: productId,
                color_name: color,
                display_order: i
              })
              .select()
              .single();

            const colorImages = newImages[color.toLowerCase()] || [];
            if (colorImages.length > 0) {
              const imageRecords = colorImages.map((imageUrl, index) => ({
                product_id: productId,
                color_id: colorData.id,
                image_url: imageUrl,
                display_order: index,
                is_primary: i === 0 && index === 0
              }));

              await supabase.from('product_images').insert(imageRecords);
            }
          }
        }
      }

      // Log audit trail
      await this._logAudit(productId, 'UPDATE', { updates });

      // Clear cache
      this.cache.clear();

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product (Admin only - soft delete)
   */
  async deleteProduct(productId) {
    if (!this.useSupabase) {
      throw new Error('Product deletion requires Supabase to be enabled');
    }

    try {
      // Soft delete by setting is_active to false
      const { data: product, error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      // Log audit trail
      await this._logAudit(productId, 'DELETE', {});

      // Clear cache
      this.cache.clear();

      return product;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Get products from Supabase with relationships
   */
  async _getProductsFromSupabase(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_features (feature_text, display_order),
        product_sizes (size, stock, is_available, display_order),
        product_colors (id, color_name, display_order),
        product_images (image_url, color_id, display_order, is_primary)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.is_hot !== undefined) {
      query = query.eq('is_hot', filters.is_hot);
    }

    if (filters.is_new !== undefined) {
      query = query.eq('is_new', filters.is_new);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform Supabase data to match static products format
    return data.map(this._transformSupabaseProduct);
  }

  /**
   * Get single product from Supabase
   */
  async _getProductFromSupabase(productId) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_features (feature_text, display_order),
        product_sizes (size, stock, is_available, display_order),
        product_colors (id, color_name, display_order),
        product_images (image_url, color_id, display_order, is_primary)
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;

    return this._transformSupabaseProduct(data);
  }

  /**
   * Transform Supabase product to static format
   */
  _transformSupabaseProduct(dbProduct) {
    // FALLBACK: Use local images for product ID with UUID (Short Magic Hombre)
    // This ensures the product works with local optimized images
    if (dbProduct.id === '6968a2c2-3e80-4c68-854a-ecd6fadca227') {
      const staticProduct = staticProducts.find(p => p.id === 2);
      if (staticProduct) {
        console.log('📦 Using local images for Short Magic Hombre');
        return {
          ...staticProduct,
          // Keep Supabase data for non-image fields
          id: dbProduct.id, // Keep UUID
          price: dbProduct.price || staticProduct.price,
          stock: dbProduct.stock || staticProduct.stock,
          rating: dbProduct.rating || staticProduct.rating,
          reviews: dbProduct.reviews || staticProduct.reviews,
          hot: dbProduct.is_hot !== undefined ? dbProduct.is_hot : staticProduct.hot,
          new: dbProduct.is_new !== undefined ? dbProduct.is_new : staticProduct.new
        };
      }
    }

    const features = (dbProduct.product_features || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map(f => f.feature_text);

    const sizes = (dbProduct.product_sizes || [])
      .sort((a, b) => a.display_order - b.display_order)
      .filter(s => s.is_available)
      .map(s => s.size);

    const colors = (dbProduct.product_colors || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map(c => c.color_name);

    const images = dbProduct.product_images || [];
    const imagesByColor = {};

    colors.forEach(color => {
      const colorLower = color.toLowerCase();
      const colorData = dbProduct.product_colors.find(c => c.color_name === color);

      if (colorData) {
        imagesByColor[colorLower] = images
          .filter(img => img.color_id === colorData.id)
          .sort((a, b) => a.display_order - b.display_order)
          .map(img => img.image_url);
      }
    });

    const allImages = images
      .sort((a, b) => a.display_order - b.display_order)
      .map(img => img.image_url);

    return {
      id: dbProduct.id,
      name: dbProduct.name,
      category: dbProduct.category,
      price: dbProduct.price,
      originalPrice: dbProduct.original_price,
      discount: dbProduct.discount,
      image: dbProduct.main_image || allImages[0] || '',
      images: allImages,
      imagesByColor,
      videoUrl: dbProduct.video_url || null,
      description: dbProduct.description,
      features,
      sizes,
      colors,
      rating: dbProduct.rating,
      reviews: dbProduct.reviews,
      stock: dbProduct.stock,
      hot: dbProduct.is_hot,
      new: dbProduct.is_new
    };
  }

  /**
   * Filter static products
   */
  _filterStaticProducts(products, filters) {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.is_hot !== undefined) {
      filtered = filtered.filter(p => p.hot === filters.is_hot);
    }

    if (filters.is_new !== undefined) {
      filtered = filtered.filter(p => p.new === filters.is_new);
    }

    return filtered;
  }

  /**
   * Log audit trail
   */
  async _logAudit(productId, action, changes) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('product_audit_log').insert({
        product_id: productId,
        action,
        changed_by: user?.id || null,
        changes
      });
    } catch (error) {
      console.warn('Failed to log audit trail:', error);
    }
  }

  /**
   * Toggle Supabase mode
   */
  setSupabaseMode(enabled) {
    this.useSupabase = enabled;
    this.cache.clear();
    console.log(`🔄 Supabase mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current mode
   */
  isSupabaseEnabled() {
    return this.useSupabase;
  }

  /**
   * Clear cache manually
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Product cache cleared');
  }
}

export default new ProductService();
