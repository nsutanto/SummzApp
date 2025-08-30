import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors, spacing } from '../../styles';
import { CategoryCard } from '../../components';
import { getCategories } from '../../utils/supabaseCategories';

const ExploreScreen = () => {
  const navigation = useNavigation();
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
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Text style={styles.placeholderText}>Personalized content will appear here</Text>
          </View>
        );
      case 'Trending':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Text style={styles.placeholderText}>Trending summaries will appear here</Text>
          </View>
        );
      case 'Categories':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            {categoriesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : categoriesError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{categoriesError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : categories.length > 0 ? (
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.id}
                    emoji={category.emoji || "�"} 
                    title={category.name} 
                    onPress={() => handleCategoryPress(category.name, category.id)} 
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.placeholderText}>No categories available</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Horizontal Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Tab Indicator Line */}
        <View style={styles.tabIndicatorContainer}>
          <View style={styles.tabIndicatorLine} />
          <View style={[
            styles.activeIndicator,
            { left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%` }
          ]} />
        </View>
        
        {/* Tab Content */}
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  tabIndicatorContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  tabIndicatorLine: {
    height: 2,
    backgroundColor: colors.border.default,
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    height: 2,
    width: '33.33%',
    backgroundColor: colors.primary,
    top: 0,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExploreScreen;
