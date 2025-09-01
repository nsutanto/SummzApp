import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../styles';

const SettingItem = ({ icon, text, onPress, isLast = false }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { borderBottomColor: theme.border.subtle },
        isLast && styles.lastMenuItem
      ]}
      onPress={onPress}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuText, { color: theme.text.primary }]}>{text}</Text>
      <Text style={[styles.menuArrow, { color: theme.text.light }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    // borderBottomColor will be set by theme
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    // color will be set by theme
  },
  menuArrow: {
    fontSize: 20,
    // color will be set by theme
  },
});

export default SettingItem;
