import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ContentItem from './ContentItem';

const HorizontalItemList = ({
  data = [],
  itemWidth = 150,
  itemHeight = 200,
  spacing = 16,
  onItemPress,
  emptyMessage = 'No items found',
  showEmptyState = true,
  itemProps = {},
  style,
  contentContainerStyle,
  ...flatListProps
}) => {
  const renderItem = ({ item, index }) => (
    <View style={[
      styles.itemContainer, 
      { 
        marginLeft: index === 0 ? 0 : spacing / 2, // First item has no left margin to align with content
        marginRight: index === data.length - 1 ? 0 : spacing / 2, // Last item has no right margin
      }
    ]}>
      <ContentItem
        item={item}
        onPress={onItemPress}
        width={itemWidth}
        height={itemHeight}
        imageHeight={itemHeight * 0.55} // Make image 55% of total height, leaving more room for 5-line title
        {...itemProps}
      />
    </View>
  );

  if (data.length === 0 && showEmptyState) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        { paddingRight: spacing }, // Add padding at the end for proper spacing
        contentContainerStyle
      ]}
      style={[styles.list, style]}
      // Performance optimizations for horizontal scrolling
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={5}
      initialNumToRender={5}
      updateCellsBatchingPeriod={50}
      getItemLayout={(data, index) => ({
        length: itemWidth + spacing,
        offset: (itemWidth + spacing) * index,
        index,
      })}
      {...flatListProps}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 0, // Prevents the list from taking up more vertical space than needed
  },
  itemContainer: {
    // Container for each item with proper spacing
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HorizontalItemList;
