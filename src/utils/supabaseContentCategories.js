import { supabase } from '../config/supabase';

/**
 * Add a category to a content item
 * @param {string} contentItemId - The content item ID
 * @param {string} categoryId - The category ID
 */
export const addCategoryToContent = async (contentItemId, categoryId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .insert({
        content_item_id: contentItemId,
        category_id: categoryId,
      })
      .select();

    if (error) throw error;
    
    console.log('Category added to content:', data);
    return data[0];
  } catch (error) {
    console.error('Error adding category to content:', error);
    throw error;
  }
};

/**
 * Remove a category from a content item
 * @param {string} contentItemId - The content item ID
 * @param {string} categoryId - The category ID
 */
export const removeCategoryFromContent = async (contentItemId, categoryId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .delete()
      .eq('content_item_id', contentItemId)
      .eq('category_id', categoryId)
      .select();

    if (error) throw error;
    
    console.log('Category removed from content:', data);
    return data;
  } catch (error) {
    console.error('Error removing category from content:', error);
    throw error;
  }
};

/**
 * Get all categories for a specific content item
 * @param {string} contentItemId - The content item ID
 */
export const getCategoriesForContent = async (contentItemId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select(`
        category_id,
        categories (
          id,
          name,
          slug,
          imageUrl
        )
      `)
      .eq('content_item_id', contentItemId);

    if (error) throw error;
    
    // Extract the categories from the nested structure
    const categories = data.map(item => item.categories);
    console.log('Categories for content:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories for content:', error);
    throw error;
  }
};

/**
 * Get all content items for a specific category
 * @param {string} categoryId - The category ID
 */
export const getContentByCategory = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select(`
        content_item_id,
        content_items (
          id,
          title,
          content_type,
          source_url,
          affiliate_link,
          cover_image_url,
          publication_year,
          created_at
        )
      `)
      .eq('category_id', categoryId);

    if (error) throw error;
    
    // Extract the content items from the nested structure
    const contentItems = data.map(item => item.content_items).filter(item => item !== null);
    console.log('Content items for category:', contentItems);
    return contentItems;
  } catch (error) {
    console.error('Error fetching content by category:', error);
    throw error;
  }
};

/**
 * Add multiple categories to a content item
 * @param {string} contentItemId - The content item ID
 * @param {string[]} categoryIds - Array of category IDs
 */
export const addMultipleCategoriesToContent = async (contentItemId, categoryIds) => {
  try {
    const insertData = categoryIds.map(categoryId => ({
      content_item_id: contentItemId,
      category_id: categoryId,
    }));

    const { data, error } = await supabase
      .from('content_categories')
      .insert(insertData)
      .select();

    if (error) throw error;
    
    console.log('Multiple categories added to content:', data);
    return data;
  } catch (error) {
    console.error('Error adding multiple categories to content:', error);
    throw error;
  }
};

/**
 * Remove all categories from a content item
 * @param {string} contentItemId - The content item ID
 */
export const removeAllCategoriesFromContent = async (contentItemId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .delete()
      .eq('content_item_id', contentItemId)
      .select();

    if (error) throw error;
    
    console.log('All categories removed from content:', data);
    return data;
  } catch (error) {
    console.error('Error removing all categories from content:', error);
    throw error;
  }
};

/**
 * Update categories for a content item (replace all existing categories)
 * @param {string} contentItemId - The content item ID
 * @param {string[]} categoryIds - Array of new category IDs
 */
export const updateContentCategories = async (contentItemId, categoryIds) => {
  try {
    // First remove all existing categories
    await removeAllCategoriesFromContent(contentItemId);
    
    // Then add the new categories
    if (categoryIds.length > 0) {
      const result = await addMultipleCategoriesToContent(contentItemId, categoryIds);
      return result;
    }
    
    return [];
  } catch (error) {
    console.error('Error updating content categories:', error);
    throw error;
  }
};

/**
 * Check if a content item has a specific category
 * @param {string} contentItemId - The content item ID
 * @param {string} categoryId - The category ID
 */
export const contentHasCategory = async (contentItemId, categoryId) => {
  try {
    const { data, error } = await supabase
      .from('content_categories')
      .select('*')
      .eq('content_item_id', contentItemId)
      .eq('category_id', categoryId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      throw error;
    }
    
    return !!data; // Returns true if relationship exists, false otherwise
  } catch (error) {
    console.error('Error checking content category relationship:', error);
    throw error;
  }
};
