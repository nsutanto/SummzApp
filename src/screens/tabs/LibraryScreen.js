import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../styles';

const LibraryScreen = () => {
  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Summaries</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No summaries yet</Text>
            <Text style={styles.emptyText}>Start creating summaries to see them here</Text>
            <TouchableOpacity style={styles.createButton}>
              <Text style={commonStyles.buttonText}>Create Your First Summary</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collections</Text>
          <View style={styles.collectionCard}>
            <Text style={styles.collectionIcon}>📚</Text>
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionName}>Favorites</Text>
              <Text style={styles.collectionCount}>0 summaries</Text>
            </View>
          </View>
          
          <View style={styles.collectionCard}>
            <Text style={styles.collectionIcon}>💼</Text>
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionName}>Work</Text>
              <Text style={styles.collectionCount}>0 summaries</Text>
            </View>
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
  emptyState: {
    backgroundColor: colors.white,
    padding: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  collectionCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
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
  collectionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  collectionCount: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
});

export default LibraryScreen;
