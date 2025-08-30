import { supabase } from '../config/supabase';

/**
 * Insert or update user data in Supabase users table using upsert
 * @param {Object} userData - The user data from Firebase
 * @param {string} userData.uid - Firebase user ID
 * @param {string} userData.email - User email
 * @param {string} userData.displayName - User full name
 * @param {string} userData.photoURL - User avatar URL (optional)
 */
export const insertUserToSupabase = async (userData) => {
  try {
    const { uid, email, displayName, photoURL } = userData;
    
    // Use upsert to insert or update user data in one operation
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: uid,
        email: email,
        full_name: displayName || email?.split('@')[0] || 'User',
        avatar_url: photoURL || null,
      })
      .select();

    if (error) throw error;
    
    console.log('User upserted to Supabase:', data);
    return data[0];
  } catch (error) {
    console.error('Error upserting user in Supabase:', error);
    throw error;
  }
};

/**
 * Get user data from Supabase
 * @param {string} userId - Firebase user ID
 */
export const getUserFromSupabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user from Supabase:', error);
    throw error;
  }
};
