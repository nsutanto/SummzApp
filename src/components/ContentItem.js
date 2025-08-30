import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { shadows } from '../styles';

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop';

const ContentItem = ({ 
  item, 
  onPress, 
  width, 
  height,
  imageHeight = 180,
  showTitle = true,
  placeholderImage = DEFAULT_PLACEHOLDER,
  style,
  imageStyle,
  titleStyle
}) => {
  const { theme } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  // Calculate total height if provided, otherwise use auto
  const containerStyle = height ? { width, height } : { width };

  return (
    <TouchableOpacity
      style={[
        styles.contentCard, 
        { backgroundColor: theme.surface }, 
        containerStyle, 
        style
      ]}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: item.cover_image_url || placeholderImage }} 
        style={[styles.contentImage, { height: imageHeight }, imageStyle]} 
      />
      {showTitle && (
        <Text 
          style={[
            styles.contentTitle, 
            { color: theme.text.primary }, 
            titleStyle
          ]} 
          numberOfLines={5} 
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    // backgroundColor will be set by theme
    borderRadius: 8,
    padding: 12,
    ...shadows.small,
  },
  contentImage: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    // color will be set by theme
    textAlign: 'center',
    height: 100, // Increased height for up to 5 lines (5 * 20 line height)
    lineHeight: 20, // Consistent line height
  },
});

export default ContentItem;
