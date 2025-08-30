import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getContentByCategory } from '../utils/supabaseContentCategories';

const { width } = Dimensions.get('window');

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryName, categoryId } = route.params || {};
  
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchContentItems();
    }
  }, [categoryId]);

  const fetchContentItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContentByCategory(categoryId);
      setContentItems(data || []);
    } catch (err) {
      console.error('Error fetching content items:', err);
      setError('Failed to load content items');
    } finally {
      setLoading(false);
    }
  };

  const renderContentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contentCard}
      onPress={() => {
        console.log('Content item selected:', item.title);
      }}
    >
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop' }} 
        style={styles.contentImage} 
      />
      <Text style={styles.contentTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((contentItem) => (
        <TouchableOpacity
          key={contentItem.id}
          style={styles.contentCard}
          onPress={() => {
            console.log('Content item selected:', contentItem.title);
          }}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop' }} 
            style={styles.contentImage} 
          />
          <Text style={styles.contentTitle}>{contentItem.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchContentItems}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contentItems.length > 0 ? (
        <FlatList
          data={chunkArray(contentItems, 2)}
          renderItem={renderRow}
          keyExtractor={(item, index) => `row-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No content found in this category</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: (width - 48) / 2, // Screen width minus padding, divided by 2
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentImage: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    numberOfLines: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ContentByCategoryScreen;
