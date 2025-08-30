import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getContentByCategory } from '../utils/supabaseContentCategories';
import { LoadingIndicator, ErrorState, ContentItem } from '../components';

const { width } = Dimensions.get('window');

// Constants
const ITEMS_PER_ROW = 2;
const PADDING = 16;
const CARD_WIDTH = (width - (PADDING * 3)) / ITEMS_PER_ROW;

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryName, categoryId } = route.params || {};
  
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchContentByCategory();
    }
  }, [categoryId]);

  const fetchContentByCategory = async () => {
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

  const handleItemPress = (item) => {
    console.log('Content item selected:', item.title);
    // TODO: Navigate to item detail screen
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((contentItem) => (
        <ContentItem
          key={contentItem.id}
          item={contentItem}
          onPress={handleItemPress}
          width={CARD_WIDTH}
        />
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
        <LoadingIndicator text="Loading content..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState 
          message={error} 
          onRetry={fetchContentByCategory} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contentItems.length > 0 ? (
        <FlatList
          data={chunkArray(contentItems, ITEMS_PER_ROW)}
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
    padding: PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING,
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
