import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { spacing } from '../../styles';
import { EmptyStateCard } from '../../components';
import { useTheme } from '../../hooks/useTheme';

const LibraryScreen = () => {
  const { theme, styles: themedStyles } = useTheme();
  const [activeTab, setActiveTab] = useState('Saved');
  const tabs = ['Saved', 'Finished', 'Lists'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Saved':
        return (
          <EmptyStateCard
            icon="🔖"
            title="No saved summaries"
            description="Save summaries you want to read later"
            buttonText="Explore Content"
            onButtonPress={() => {}}
          />
        );
      case 'Finished':
        return (
          <EmptyStateCard
            icon="✅"
            title="No finished summaries"
            description="Completed summaries will appear here"
            buttonText="Start Reading"
            onButtonPress={() => {}}
          />
        );
      case 'Lists':
        return (
          <EmptyStateCard
            icon="📝"
            title="No lists created"
            description="Create custom lists to organize your content"
            buttonText="Create List"
            onButtonPress={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.content}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>My Library</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: theme.text.secondary },
                activeTab === tab && [styles.activeTabText, { color: theme.text.primary }]
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Tab Indicator Line */}
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
        
        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color will be set by theme
    marginBottom: spacing.lg,
  },
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
    // color will be set by theme
  },
  activeTabText: {
    // color will be set by theme
    fontWeight: 'bold',
  },
  tabIndicatorContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  tabIndicatorLine: {
    height: 2,
    // backgroundColor will be set by theme
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    height: 2,
    width: '33.33%',
    // backgroundColor will be set by theme
    top: 0,
  },
  contentContainer: {
    flex: 1,
  },
});

export default LibraryScreen;
