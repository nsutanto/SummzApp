import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const MenuItem = ({ icon, text, onPress, isLast = false }) => {
  const { styles } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={onPress}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuText}>{text}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;
