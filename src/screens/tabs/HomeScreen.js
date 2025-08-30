import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, colors, spacing, typography } from '../../styles';
import { Card, LoadingIndicator, ErrorState, HorizontalItemList } from '../../components';
import { getCategories } from '../../utils/supabaseCategories';
import { getContentByCategory } from '../../utils/supabaseContentCategories';

const HomeScreen = () => {
  const { user } = useAuth();
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
      
      // Fetch categories first
      const categoriesData = await getCategories();
      setCategories(categoriesData || []);
      
      // Fetch content for each category
      const contentPromises = categoriesData.map(async (category) => {
        try {
          const content = await getContentByCategory(category.id);
          return { categoryId: category.id, content: content || [] };
        } catch (err) {
          console.error(`Error fetching content for category ${category.name}:`, err);
          return { categoryId: category.id, content: [] };
        }
      });
      
      const contentResults = await Promise.all(contentPromises);
      const contentMap = {};
      contentResults.forEach(({ categoryId, content }) => {
        contentMap[categoryId] = content;
      });
      
      setCategoryContent(contentMap);
    } catch (err) {
      console.error('Error fetching categories and content:', err);
      setError('Failed to load content');
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
      <View style={[commonStyles.container, commonStyles.centered]}>
        <LoadingIndicator text="Loading home content..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <ErrorState
          message={error}
          onRetry={fetchCategoriesAndContent}
        />
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarWrapper}>
            <Icon name="search" size={24} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search for books"
              placeholderTextColor={colors.text.secondary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Categories with Horizontal Lists */}
        {categories.map((category) => {
          const content = categoryContent[category.id] || [];
          
          // Only show categories that have content
          if (content.length === 0) return null;
          
          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryTitle} numberOfLines={2}>
                    {category.name}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <HorizontalItemList
                data={content}
                onItemPress={handleItemPress}
                itemWidth={140}
                itemHeight={190}
                spacing={20} // Match the content padding (spacing.lg)
              />
            </View>
          );
        })}
        
        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
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
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to align tops when text wraps
    marginBottom: 12,
    paddingHorizontal: 0, // Remove extra padding to align with content padding
    width: '100%', // Ensure full width
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
    lineHeight: 26, // Add consistent line height (1.3x the font size of 20px)
    flex: 1, // Take up available space
    textAlign: 'left', // Ensure consistent left alignment for multi-line text
    includeFontPadding: false, // Remove extra font padding on Android
    textAlignVertical: 'top', // Align text to top on Android
    paddingLeft: 0, // Ensure no left padding
    marginLeft: 0, // Ensure no left margin
  },
  seeAllText: {
    ...typography.bodySecondary,
    color: colors.primary,
    fontWeight: '600',
    flexShrink: 0, // Prevent "See All" from shrinking
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

export default HomeScreen;
