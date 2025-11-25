import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validación silenciosa en producción
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('❌ Supabase credentials missing! Check .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Email subscription functions
export const subscribeEmail = async (email, metadata = {}) => {
  try {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .insert([
        {
          email,
          source: metadata.source || 'popup',
          ip_address: metadata.ip_address || null,
          user_agent: metadata.user_agent || navigator.userAgent
        }
      ])
      .select();

    if (error) {
      // If email already exists, return success (duplicate key error)
      if (error.code === '23505') {
        return { data: null, error: null, duplicate: true };
      }
      throw error;
    }

    return { data, error: null, duplicate: false };
  } catch (error) {
    console.error('Error subscribing email:', error);
    return { data: null, error };
  }
};

// Admin functions
export const getEmailSubscriptions = async (page = 1, limit = 50) => {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('email_subscriptions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return { data, error: null, count };
  } catch (error) {
    console.error('Error fetching email subscriptions:', error);
    return { data: null, error, count: 0 };
  }
};

export const searchEmails = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .select('*')
      .ilike('email', `%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error searching emails:', error);
    return { data: null, error };
  }
};

export const getEmailStats = async () => {
  try {
    // Total count
    const { count: totalCount, error: totalError } = await supabase
      .from('email_subscriptions')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayCount, error: todayError } = await supabase
      .from('email_subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (todayError) throw todayError;

    // This week's count
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const { count: weekCount, error: weekError } = await supabase
      .from('email_subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    if (weekError) throw weekError;

    return {
      total: totalCount || 0,
      today: todayCount || 0,
      week: weekCount || 0,
      error: null
    };
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return { total: 0, today: 0, week: 0, error };
  }
};

// Auth functions
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};