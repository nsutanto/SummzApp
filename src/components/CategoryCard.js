import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles';

const CategoryCard = ({ emoji, title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.categoryCard, style]} onPress={onPress}>
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={styles.categoryText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default CategoryCard;
