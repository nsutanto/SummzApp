import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, shadows, typography } from '../../styles';
import { LoadingIndicator, ErrorState, HorizontalItemList } from '../../components';
import { getCategories } from '../../utils/supabaseCategories';
import { getContentByCategory } from '../../utils/supabaseContentCategories';
import { useTheme } from '../../hooks/useTheme';

const HomeScreen = () => {
  const { theme, styles: themedStyles } = useTheme();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryContent, setCategoryContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoriesAndContent();
  }, []);

  const fetchCategoriesAndContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await getCategories();
      setCategories(categoriesData || []);
      
      const contentPromises = categoriesData.map(async (category) => {
        try {
          const content = await getContentByCategory(category.id);
          return { categoryId: category.id, content: content || [] };
        } catch (err) {
          console.warn(`Failed to load content for category ${category.id}:`, err);
          return { categoryId: category.id, content: [] };
        }
      });
      
      const contentResults = await Promise.all(contentPromises);
      const contentMap = contentResults.reduce((acc, { categoryId, content }) => {
        acc[categoryId] = content;
        return acc;
      }, {});
      
      setCategoryContent(contentMap);
    } catch (err) {
      console.error('Error fetching categories and content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item) => {
    console.log('Item pressed:', item);
    // TODO: Navigate to item detail screen
  };

  if (loading) {
    return (
      <View style={[themedStyles.container, themedStyles.centered, { backgroundColor: theme.background }]}>
        <LoadingIndicator text="Loading home content..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[themedStyles.container, themedStyles.centered, { backgroundColor: theme.background }]}>
        <ErrorState
          message={error}
          onRetry={fetchCategoriesAndContent}
        />
      </View>
    );
  }

  return (
    <ScrollView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.content}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={[
            styles.searchBarWrapper, 
            { 
              backgroundColor: theme.surface,
              borderColor: theme.border.light 
            }
          ]}>
            <Icon 
              name="search" 
              size={24} 
              color={theme.text.secondary} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={[styles.searchBar, { color: theme.text.primary }]}
              placeholder="Search for books"
              placeholderTextColor={theme.text.secondary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Category Sections */}
        {categories.map((category) => {
          const content = categoryContent[category.id] || [];
          
          if (content.length === 0) return null;
          
          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text 
                    style={[styles.categoryTitle, { color: theme.text.primary }]} 
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: theme.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              
              <HorizontalItemList
                data={content}
                onItemPress={handleItemPress}
                itemWidth={140}
                itemHeight={190}
                spacing={spacing.lg}
              />
            </View>
          );
        })}
        
        {/* Empty State */}
        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              No categories available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    marginTop: Platform.OS === 'ios' ? 0 : 16,
    marginBottom: 24,
  },
  searchBarWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    ...typography.body,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 0,
    width: '100%',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
    lineHeight: 26,
  },
  categoryTitle: {
    ...typography.subtitle,
    lineHeight: 26,
    flex: 1,
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  seeAllText: {
    ...typography.bodySecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.body,
  },
});

export default HomeScreen;
