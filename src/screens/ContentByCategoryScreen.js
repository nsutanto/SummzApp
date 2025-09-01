import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getContentByCategory } from '../utils/supabaseContentCategories';
import { LoadingIndicator, ErrorState, VerticalItemList } from '../components';
import { useTheme } from '../hooks/useTheme';

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();
  const { categoryName, categoryId } = route.params || {};
  
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure header with theme colors when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        title: categoryName || 'Content',
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          color: theme.text.primary,
        },
        headerShadowVisible: false,
      });
    }, [navigation, theme, categoryName])
  );

  useEffect(() => {
    if (categoryId) {
      fetchContentByCategory();
    } else {
      console.warn('ContentByCategoryScreen: No categoryId provided');
      setError('Invalid category');
      setLoading(false);
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
    // TODO: Navigate to content detail screen
    // navigation.navigate('ContentDetailScreen', { contentId: item.id });
  };

  // Loading State
  if (loading) {
    return (
      <View style={[themedStyles.container, themedStyles.centered]}>
        <LoadingIndicator text="Loading content..." />
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={[themedStyles.container, themedStyles.centered]}>
        <ErrorState 
          message={error} 
          onRetry={fetchContentByCategory} 
        />
      </View>
    );
  }

  // Main Content
  return (
    <View style={themedStyles.container}>
      <VerticalItemList
        data={contentItems}
        onItemPress={handleItemPress}
        emptyMessage={`No content found in ${categoryName || 'this category'}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles moved to themedStyles from useTheme
});

export default ContentByCategoryScreen;
