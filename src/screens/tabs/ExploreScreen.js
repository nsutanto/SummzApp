import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ExploreScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
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
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
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
    color: '#333',
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  summaryMeta: {
    fontSize: 12,
    color: '#999',
  },
});

export default ExploreScreen;
