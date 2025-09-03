import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import { spacing } from '../../styles';

const IconButton = ({
  iconName,
  iconLibrary,
  iconSize = 24,
  iconColor,
  onPress,
  style,
  disabled = false,
  activeOpacity = 0.7,
  buttonStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      {...props}
    >
      <AppIcon
        library={iconLibrary}
        name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
