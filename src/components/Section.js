import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, shadows } from '../styles';

const Section = ({ title, children, style }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.section, 
      { backgroundColor: theme.surface },
      style
    ]}>
      {title && (
        <Text style={[
          styles.sectionHeader, 
          { 
            color: theme.text.primary,
            backgroundColor: theme.surface // Changed from theme.background to theme.surface
          }
        ]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    // backgroundColor will be set by theme
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.small,
    overflow: 'hidden', // This ensures child elements don't overflow the rounded corners
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    // color will be set by theme
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 8,
    // backgroundColor will be set by theme
    // Removed borderTopLeftRadius and borderTopRightRadius since overflow: 'hidden' handles this
  },
});

export default Section;
