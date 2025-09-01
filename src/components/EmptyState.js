import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, shadows } from '../styles/globalStyles';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonPress,
  style 
}) => {
  const { theme, styles: themedStyles } = useTheme();
  
  return (
    <View style={[styles.emptyState, { backgroundColor: theme.surface }, style]}>
      {icon && <Text style={styles.emptyIcon}>{icon}</Text>}
      {title && <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>{title}</Text>}
      {description && <Text style={[styles.emptyDescription, { color: theme.text.secondary }]}>{description}</Text>}
      {buttonText && onButtonPress && (
        <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={onButtonPress}>
          <Text style={themedStyles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
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
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default EmptyState;
