import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { spacing, shadows } from '../styles';
import { useTheme } from '../hooks/useTheme';

const CategoryCard = ({ emoji, title, onPress, style }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { backgroundColor: theme.surface },
        style
      ]} 
      onPress={onPress}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={[styles.categoryText, { color: theme.text.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    // backgroundColor will be set by theme
    width: '48%',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    ...shadows.small,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    // color will be set by theme
  },
});

export default CategoryCard;
