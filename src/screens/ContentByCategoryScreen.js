import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getContentByCategory } from '../utils/supabaseContentCategories';
import { LoadingIndicator, ErrorState, VerticalItemList } from '../components';
import { useTheme } from '../hooks/useTheme';

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { categoryName, categoryId } = route.params || {};
  
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchContentByCategory();
    }
  }, [categoryId]);

  const fetchContentByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContentByCategory(categoryId);
      setContentItems(data || []);
    } catch (err) {
      console.error('Error fetching content items:', err);
      setError('Failed to load content items');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item) => {
    console.log('Content item selected:', item.title);
    // TODO: Navigate to item detail screen
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LoadingIndicator text="Loading content..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState 
          message={error} 
          onRetry={fetchContentByCategory} 
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <VerticalItemList
        data={contentItems}
        onItemPress={handleItemPress}
        emptyMessage="No content found in this category"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set by theme
  },
});

export default ContentByCategoryScreen;
