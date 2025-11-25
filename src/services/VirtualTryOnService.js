import { supabase } from './supabaseClient';

class VirtualTryOnService {
  constructor() {
    this.useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all virtual try-on products (active only for public)
   */
  async getProducts(includeInactive = false) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    const cacheKey = `products_${includeInactive}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      let query = supabase
        .from('virtual_tryon_products')
        .select('*')
        .order('display_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching virtual try-on products:', error);
      throw error;
    }
  }

  /**
   * Get single virtual try-on product by ID
   */
  async getProduct(productId) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    try {
      const { data, error } = await supabase
        .from('virtual_tryon_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching virtual try-on product:', error);
      throw error;
    }
  }

  /**
   * Create new virtual try-on product
   */
  async createProduct(productData) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    try {
      const { data, error } = await supabase
        .from('virtual_tryon_products')
        .insert({
          product_id: productData.product_id || null,
          name: productData.name,
          display_name: productData.display_name,
          display_image_url: productData.display_image_url,
          reference_image_url: productData.reference_image_url,
          ai_prompt: productData.ai_prompt,
          is_active: productData.is_active ?? true,
          display_order: productData.display_order ?? 0
        })
        .select()
        .single();

      if (error) throw error;

      this.clearCache();
      return data;
    } catch (error) {
      console.error('Error creating virtual try-on product:', error);
      throw error;
    }
  }

  /**
   * Update existing virtual try-on product
   */
  async updateProduct(productId, updates) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    try {
      const updateData = {};

      if (updates.product_id !== undefined) updateData.product_id = updates.product_id;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.display_name !== undefined) updateData.display_name = updates.display_name;
      if (updates.display_image_url !== undefined) updateData.display_image_url = updates.display_image_url;
      if (updates.reference_image_url !== undefined) updateData.reference_image_url = updates.reference_image_url;
      if (updates.ai_prompt !== undefined) updateData.ai_prompt = updates.ai_prompt;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.display_order !== undefined) updateData.display_order = updates.display_order;

      const { data, error } = await supabase
        .from('virtual_tryon_products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      this.clearCache();
      return data;
    } catch (error) {
      console.error('Error updating virtual try-on product:', error);
      throw error;
    }
  }

  /**
   * Delete virtual try-on product
   */
  async deleteProduct(productId) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    try {
      const { error } = await supabase
        .from('virtual_tryon_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      this.clearCache();
      return true;
    } catch (error) {
      console.error('Error deleting virtual try-on product:', error);
      throw error;
    }
  }

  /**
   * Upload image to Supabase Storage
   */
  async uploadImage(file, path) {
    if (!this.useSupabase) {
      throw new Error('Virtual Try-On requires Supabase to be enabled');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('virtual-tryon-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('virtual-tryon-images')
        .getPublicUrl(filePath);

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
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Virtual Try-On cache cleared');
  }
}

export default new VirtualTryOnService();
