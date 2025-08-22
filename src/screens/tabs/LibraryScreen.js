import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors, spacing } from '../../styles';
import { EmptyState } from '../../components';

const LibraryScreen = () => {
  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Summaries</Text>
          <EmptyState
            icon="📖"
            title="No summaries yet"
            description="Start creating summaries to see them here"
            buttonText="Create Your First Summary"
            onButtonPress={() => {}}
          />
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
