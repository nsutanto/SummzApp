import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../styles';
import { EmptyState } from '../../components';

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState('Saved');
  const tabs = ['Saved', 'Finished', 'Lists'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Saved':
        return (
          <EmptyState
            icon="🔖"
            title="No saved summaries"
            description="Save summaries you want to read later"
            buttonText="Explore Content"
            onButtonPress={() => {}}
          />
        );
      case 'Finished':
        return (
          <EmptyState
            icon="✅"
            title="No finished summaries"
            description="Completed summaries will appear here"
            buttonText="Start Reading"
            onButtonPress={() => {}}
          />
        );
      case 'Lists':
        return (
          <EmptyState
            icon="�"
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
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>My Library</Text>
        
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
    color: colors.text.primary,
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
  contentContainer: {
    flex: 1,
  },
});

export default LibraryScreen;
