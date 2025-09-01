import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, shadows } from '../styles';
import { useTheme } from '../hooks/useTheme';

const EmptyStateCard = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonPress,
  style 
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: theme.surface }, style]}>
      {icon && <Text style={styles.emptyIcon}>{icon}</Text>}
      {title && <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>{title}</Text>}
      {description && <Text style={[styles.emptyDescription, { color: theme.text.secondary }]}>{description}</Text>}
      {buttonText && onButtonPress && (
        <TouchableOpacity 
          style={[styles.emptyButton, { backgroundColor: theme.primary }]} 
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    // backgroundColor will be set by theme
    padding: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color will be set by theme
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    // color will be set by theme
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    // backgroundColor will be set by theme
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff', // White text on colored button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyStateCard;
