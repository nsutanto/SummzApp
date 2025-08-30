import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing, typography } from '../../styles';
import { CategoryCard, LoadingIndicator, ErrorState } from '../../components';
import { getCategories } from '../../utils/supabaseCategories';
import { useTheme } from '../../hooks/useTheme';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();
  const [activeTab, setActiveTab] = useState('For you');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  
  const tabs = ['For you', 'Trending', 'Categories'];

  const handleCategoryPress = (categoryTitle, categoryId) => {
    navigation.navigate('ContentByCategoryScreen', { 
      categoryName: categoryTitle,
      categoryId: categoryId 
    });
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoriesError('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    // Fetch categories when Categories tab is selected
    if (tab === 'Categories' && categories.length === 0) {
      fetchCategories();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'For you':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Recommended for You
            </Text>
            <Text style={[styles.placeholderText, { color: theme.text.secondary }]}>
              Personalized content will appear here
            </Text>
          </View>
        );
        
      case 'Trending':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Trending Now
            </Text>
            <Text style={[styles.placeholderText, { color: theme.text.secondary }]}>
              Trending summaries will appear here
            </Text>
          </View>
        );
        
      case 'Categories':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Browse Categories
            </Text>
            {categoriesLoading && (
              <LoadingIndicator 
                text="Loading categories..." 
                color={theme.primary}
                style={styles.centerContainer}
              />
            )}
            {categoriesError && (
              <ErrorState 
                message={categoriesError} 
                onRetry={fetchCategories} 
                style={styles.centerContainer}
              />
            )}
            {!categoriesLoading && !categoriesError && categories.length > 0 && (
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.id}
                    emoji={category.emoji || "📁"} 
                    title={category.name} 
                    onPress={() => handleCategoryPress(category.name, category.id)} 
                  />
                ))}
              </View>
            )}
            {!categoriesLoading && !categoriesError && categories.length === 0 && (
              <Text style={[styles.placeholderText, { color: theme.text.secondary }]}>
                No categories available
              </Text>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <ScrollView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: theme.text.secondary },
                activeTab === tab && { color: theme.text.primary, fontWeight: 'bold' }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Tab Indicator */}
        <View style={styles.tabIndicatorContainer}>
          <View style={[styles.tabIndicatorLine, { backgroundColor: theme.border.default }]} />
          <View style={[
            styles.activeIndicator,
            { 
              left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
              backgroundColor: theme.primary
            }
          ]} />
        </View>
        
        {/* Content */}
        {renderTabContent()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabText: {
    ...typography.body,
    fontWeight: '500',
  },
  tabIndicatorContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  tabIndicatorLine: {
    height: 2,
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    height: 2,
    width: '33.33%',
    top: 0,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  placeholderText: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  centerContainer: {
    padding: spacing.xl,
  },
});

export default ExploreScreen;
