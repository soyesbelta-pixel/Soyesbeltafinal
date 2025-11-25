/**
 * Virtual Try-On User Service - VERSIÓN SIMPLE CON LÍMITE
 * Solo verifica registro y cuenta generaciones (máximo 5)
 */

import VirtualTryOnLeadsService from './VirtualTryOnLeadsService';

const STORAGE_KEY = 'virtual-tryon-registered';
const TRIES_KEY = 'virtual-tryon-tries';
const MAX_TRIES = 5;

class VirtualTryOnUserService {
  /**
   * Check if user is already registered
   */
  static isRegistered() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  }

  /**
   * Get remaining tries
   */
  static getRemainingTries() {
    try {
      const tries = localStorage.getItem(TRIES_KEY);
      return tries ? parseInt(tries, 10) : MAX_TRIES;
    } catch (error) {
      console.error('Error getting tries:', error);
      return MAX_TRIES;
    }
  }

  /**
   * Check if user can generate (has tries remaining)
   */
  static canGenerate() {
    return this.getRemainingTries() > 0;
  }

  /**
   * Use one try (decrement counter)
   */
  static useTry() {
    try {
      const remaining = this.getRemainingTries();
      if (remaining > 0) {
        localStorage.setItem(TRIES_KEY, String(remaining - 1));
        console.log(`✅ Try used. Remaining: ${remaining - 1}`);
        return remaining - 1;
      }
      console.warn('⚠️ No tries remaining');
      return 0;
    } catch (error) {
      console.error('Error using try:', error);
      return 0;
    }
  }

  /**
   * Register user (save to Supabase and mark as registered)
   */
  static async registerUser(userName, whatsapp) {
    try {
      console.log('📝 Registering user:', { userName, whatsapp });

      // Save to Supabase
      const success = await VirtualTryOnLeadsService.saveLead(userName, whatsapp);

      if (success) {
        // Mark as registered and set tries
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(TRIES_KEY, String(MAX_TRIES));
        console.log('✅ User registered successfully with 5 tries');
        return true;
      }

      console.warn('⚠️ Failed to save to Supabase, but continuing...');
      // Still mark as registered to not annoy the user
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(TRIES_KEY, String(MAX_TRIES));
      return true;
    } catch (error) {
      console.error('❌ Error registering user:', error);
      // Even on error, mark as registered to not block the user
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(TRIES_KEY, String(MAX_TRIES));
      return true;
    }
  }

  /**
   * Clear registration (for testing)
   */
  static clearRegistration() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TRIES_KEY);
      console.log('🗑️ Registration and tries cleared');
    } catch (error) {
      console.error('Error clearing registration:', error);
    }
  }
}

export default VirtualTryOnUserService;
