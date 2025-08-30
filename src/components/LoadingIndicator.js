import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const LoadingIndicator = ({ 
  size = 'large', 
  color, 
  text = 'Loading...', 
  showText = true,
  style 
}) => {
  const { theme } = useTheme();
  
  const indicatorColor = color || theme.primary;
  
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {showText && (
        <Text style={[styles.text, { color: theme.text.primary }]}>{text}</Text>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
};

export default LoadingIndicator;
