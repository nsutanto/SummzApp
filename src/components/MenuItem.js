import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const MenuItem = ({ icon, text, onPress, isLast = false }) => {
  const { commonStyles } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[commonStyles.menuItem, isLast && commonStyles.lastMenuItem]}
      onPress={onPress}
    >
      <Text style={commonStyles.menuIcon}>{icon}</Text>
      <Text style={commonStyles.menuText}>{text}</Text>
      <Text style={commonStyles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;
