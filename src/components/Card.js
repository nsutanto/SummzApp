import React from 'react';
import { View, StyleSheet } from 'react-native';
import { commonStyles, shadows } from '../styles';

const Card = ({ children, style, padding = 'default' }) => {
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
