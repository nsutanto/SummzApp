import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import ContentItem from './ContentItem';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

const VerticalItemList = ({
  data = [],
  itemsPerRow = 2,
  padding = 16,
  onItemPress,
  emptyMessage = 'No items found',
  showEmptyState = true,
  itemProps = {},
  style,
  contentContainerStyle,
  ...flatListProps
}) => {
  const { theme } = useTheme();
  
  // Calculate card width based on screen width and padding
  const CARD_WIDTH = (width - (padding * (itemsPerRow + 1))) / itemsPerRow;

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const renderRow = ({ item }) => (
    <View style={[styles.row, { marginBottom: padding }]}>
      {item.map((contentItem) => (
        <ContentItem
          key={contentItem.id}
          item={contentItem}
          onPress={onItemPress}
          width={CARD_WIDTH}
          {...itemProps}
        />
      ))}
    </View>
  );

  if (data.length === 0 && showEmptyState) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.text.secondary }]}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chunkArray(data, itemsPerRow)}
      renderItem={renderRow}
      keyExtractor={(item, index) => `row-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { padding },
        contentContainerStyle
      ]}
      style={style}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      {...flatListProps}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    // color will be set by theme
    textAlign: 'center',
  },
});

export default VerticalItemList;
