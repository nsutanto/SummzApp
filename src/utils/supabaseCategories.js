import { supabase } from '../config/supabase';

/**
 * Fetch all categories from Supabase
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    
    console.log('Categories fetched from Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    throw error;
  }
};

/**
 * Fetch a single category by ID
 * @param {string} categoryId - The category ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching category from Supabase:', error);
    throw error;
  }
};

/**
 * Fetch a category by slug
 * @param {string} slug - The category slug
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching category by slug from Supabase:', error);
    throw error;
  }
};
