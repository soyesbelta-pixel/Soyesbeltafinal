import { supabase } from './supabaseClient';
import { supabaseAdmin } from './supabaseAdmin';

/**
 * Virtual Try-On Leads Service - VERSIÓN SIMPLE
 * Solo captura nombre y WhatsApp
 */
class VirtualTryOnLeadsService {
  /**
   * Save lead in Supabase (compatible with full schema)
   * Works for both landing page (simple) and main app (full tracking)
   */
  static async saveLead(userName, whatsapp) {
    try {
      console.log('💾 Saving lead:', { userName, whatsapp });

      // Generate unique session_id for landing page leads
      const sessionId = `landing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error } = await supabase
        .from('virtual_tryon_leads')
        .insert({
          session_id: sessionId,
          user_name: userName,
          whatsapp: whatsapp,
          total_generations: 0,
          remaining_tries: 5,
          engagement_level: 'low'
        });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Lead saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving lead:', error);
      return false;
    }
  }

  /**
   * Get all leads (for admin dashboard)
   */
  static async getAllLeads() {
    try {
      const { data, error } = await supabaseAdmin
        .from('virtual_tryon_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  /**
   * Delete a lead
   */
  static async deleteLead(leadId) {
    try {
      const { error } = await supabaseAdmin
        .from('virtual_tryon_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  /**
   * Export leads to CSV
   */
  static async exportLeadsToCSV() {
    try {
      const leads = await this.getAllLeads();

      const headers = ['Nombre', 'WhatsApp', 'Fecha'];
      const rows = leads.map(lead => [
        lead.user_name,
        lead.whatsapp,
        new Date(lead.created_at).toLocaleString('es-MX')
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting leads:', error);
      throw error;
    }
  }

  /**
   * Get total leads count
   */
  static async getLeadsCount() {
    try {
      const leads = await this.getAllLeads();
      return leads.length;
    } catch (error) {
      console.error('Error getting leads count:', error);
      return 0;
    }
  }
}

export default VirtualTryOnLeadsService;
