import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { spacing, typography } from '../../styles';
import { useTheme } from '../../hooks/useTheme';

const ExploreScreen = () => {
  const { theme, styles: themedStyles } = useTheme();
  const [activeTab, setActiveTab] = useState('For you');
  
  const tabs = ['For you', 'Trending', 'Categories'];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
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
            <Text style={[styles.placeholderText, { color: theme.text.secondary }]}>
              No categories available
            </Text>
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
});

export default ExploreScreen;
