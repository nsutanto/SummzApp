import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors, spacing } from '../../styles';
import { CategoryCard } from '../../components';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('For you');
  const tabs = ['For you', 'Trending', 'Categories'];

  const handleCategoryPress = (categoryTitle) => {
    navigation.navigate('ContentByCategoryScreen', { 
      categoryName: categoryTitle 
    });
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
            <View style={styles.categoryGrid}>
              <CategoryCard 
                emoji="📚" 
                title="Education" 
                onPress={() => handleCategoryPress('Education')} 
              />
              <CategoryCard 
                emoji="💼" 
                title="Business" 
                onPress={() => handleCategoryPress('Business')} 
              />
              <CategoryCard 
                emoji="🔬" 
                title="Science" 
                onPress={() => handleCategoryPress('Science')} 
              />
              <CategoryCard 
                emoji="🎨" 
                title="Arts" 
                onPress={() => handleCategoryPress('Arts')} 
              />
            </View>
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
              onPress={() => setActiveTab(tab)}
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
});

export default ExploreScreen;
