import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, commonStyles } from '../styles';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonPress,
  style 
}) => {
  return (
    <View style={[styles.emptyState, style]}>
      {icon && <Text style={styles.emptyIcon}>{icon}</Text>}
      {title && <Text style={styles.emptyTitle}>{title}</Text>}
      {description && <Text style={styles.emptyDescription}>{description}</Text>}
      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.emptyButton} onPress={onButtonPress}>
          <Text style={commonStyles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: colors.white,
    padding: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default EmptyState;
