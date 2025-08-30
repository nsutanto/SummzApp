import React from 'react';
import { View, StyleSheet } from 'react-native';
import { shadows } from '../styles';
import { useTheme } from '../hooks/useTheme';

const Card = ({ children, style, padding = 'default' }) => {
  const { commonStyles } = useTheme();
  const paddingStyle = padding === 'large' ? styles.largePadding : styles.defaultPadding;
  
  return (
    <View style={[commonStyles.card, paddingStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultPadding: {
    padding: 20,
  },
  largePadding: {
    padding: 30,
  },
});

export default Card;
