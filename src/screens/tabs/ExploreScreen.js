import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../styles';

const ExploreScreen = () => {
  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Categories</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>📚</Text>
              <Text style={styles.categoryText}>Education</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>💼</Text>
              <Text style={styles.categoryText}>Business</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🔬</Text>
              <Text style={styles.categoryText}>Science</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🎨</Text>
              <Text style={styles.categoryText}>Arts</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Summaries</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Getting Started with AI</Text>
            <Text style={styles.summaryDescription}>A comprehensive guide to understanding artificial intelligence...</Text>
            <Text style={styles.summaryMeta}>5 min read • 1.2k views</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: colors.white,
    width: '48%',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  summaryMeta: {
    fontSize: 12,
    color: colors.text.light,
  },
});

export default ExploreScreen;
