import { supabase } from '../config/supabase';

/**
 * Create a new content item
 * @param {Object} contentData - The content item data
 * @param {string} contentData.title - Content title
 * @param {string} contentData.content_type - Content type (enum value)
 * @param {string} contentData.source_url - URL for the original source
 * @param {string} [contentData.affiliate_link] - Purchase or affiliate link (optional)
 * @param {string} [contentData.cover_image_url] - Cover image URL (optional)
 * @param {number} [contentData.publication_year] - Publication year (optional)
 */
export const createContentItem = async (contentData) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .insert(contentData)
      .select();

    if (error) throw error;
    
    console.log('Content item created:', data);
    return data[0];
  } catch (error) {
    console.error('Error creating content item:', error);
    throw error;
  }
};

/**
 * Get all content items with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {string} [options.content_type] - Filter by content type
 * @param {number} [options.publication_year] - Filter by publication year
 * @param {number} [options.limit] - Limit number of results
 * @param {number} [options.offset] - Offset for pagination
 * @param {string} [options.orderBy] - Column to order by (default: 'created_at')
 * @param {boolean} [options.ascending] - Order direction (default: false)
 */
export const getContentItems = async (options = {}) => {
  try {
    let query = supabase
      .from('content_items')
      .select('*');

    // Apply filters
    if (options.content_type) {
      query = query.eq('content_type', options.content_type);
    }
    
    if (options.publication_year) {
      query = query.eq('publication_year', options.publication_year);
    }

    // Apply ordering
    const orderBy = options.orderBy || 'created_at';
    const ascending = options.ascending || false;
    query = query.order(orderBy, { ascending });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    console.log('Content items fetched:', data?.length || 0);
    return data;
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
};

/**
 * Get a single content item by ID
 * @param {string} contentId - The content item ID
 */
export const getContentItemById = async (contentId) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', contentId)
      .single();

    if (error) throw error;
    
    console.log('Content item fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching content item:', error);
    throw error;
  }
};

/**
 * Update a content item
 * @param {string} contentId - The content item ID
 * @param {Object} updateData - The data to update
 */
export const updateContentItem = async (contentId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .update(updateData)
      .eq('id', contentId)
      .select();

    if (error) throw error;
    
    console.log('Content item updated:', data);
    return data[0];
  } catch (error) {
    console.error('Error updating content item:', error);
    throw error;
  }
};

/**
 * Delete a content item
 * @param {string} contentId - The content item ID
 */
export const deleteContentItem = async (contentId) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', contentId)
      .select();

    if (error) throw error;
    
    console.log('Content item deleted:', data);
    return data[0];
  } catch (error) {
    console.error('Error deleting content item:', error);
    throw error;
  }
};

/**
 * Search content items by title
 * @param {string} searchTerm - The search term
 * @param {Object} options - Additional options
 * @param {number} [options.limit] - Limit number of results
 */
export const searchContentItems = async (searchTerm, options = {}) => {
  try {
    let query = supabase
      .from('content_items')
      .select('*')
      .ilike('title', `%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    console.log('Search results:', data?.length || 0);
    return data;
  } catch (error) {
    console.error('Error searching content items:', error);
    throw error;
  }
};

/**
 * Get content items by content type
 * @param {string} contentType - The content type
 * @param {Object} options - Additional options
 * @param {number} [options.limit] - Limit number of results
 * @param {string} [options.orderBy] - Column to order by
 * @param {boolean} [options.ascending] - Order direction
 */
export const getContentItemsByType = async (contentType, options = {}) => {
  try {
    let query = supabase
      .from('content_items')
      .select('*')
      .eq('content_type', contentType);

    const orderBy = options.orderBy || 'created_at';
    const ascending = options.ascending || false;
    query = query.order(orderBy, { ascending });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    console.log(`Content items of type ${contentType}:`, data?.length || 0);
    return data;
  } catch (error) {
    console.error('Error fetching content items by type:', error);
    throw error;
  }
};

/**
 * Get content items by publication year
 * @param {number} year - The publication year
 * @param {Object} options - Additional options
 * @param {number} [options.limit] - Limit number of results
 */
export const getContentItemsByYear = async (year, options = {}) => {
  try {
    let query = supabase
      .from('content_items')
      .select('*')
      .eq('publication_year', year)
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    console.log(`Content items from ${year}:`, data?.length || 0);
    return data;
  } catch (error) {
    console.error('Error fetching content items by year:', error);
    throw error;
  }
};

/**
 * Get content items with categories (includes category information)
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Limit number of results
 * @param {string} [options.content_type] - Filter by content type
 */
export const getContentItemsWithCategories = async (options = {}) => {
  try {
    let query = supabase
      .from('content_items')
      .select(`
        *,
        content_categories (
          categories (
            id,
            name,
            slug,
            imageUrl
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (options.content_type) {
      query = query.eq('content_type', options.content_type);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Flatten the categories structure
    const contentWithCategories = data?.map(item => ({
      ...item,
      categories: item.content_categories?.map(cc => cc.categories) || []
    }));

    console.log('Content items with categories fetched:', contentWithCategories?.length || 0);
    return contentWithCategories;
  } catch (error) {
    console.error('Error fetching content items with categories:', error);
    throw error;
  }
};

/**
 * Get recent content items
 * @param {number} [limit=10] - Number of recent items to fetch
 */
export const getRecentContentItems = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    console.log('Recent content items fetched:', data?.length || 0);
    return data;
  } catch (error) {
    console.error('Error fetching recent content items:', error);
    throw error;
  }
};

/**
 * Get content items count by type
 */
export const getContentItemsCountByType = async () => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('content_type')
      .order('content_type');

    if (error) throw error;
    
    // Count items by type
    const counts = data.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1;
      return acc;
    }, {});

    console.log('Content items count by type:', counts);
    return counts;
  } catch (error) {
    console.error('Error fetching content items count by type:', error);
    throw error;
  }
};
