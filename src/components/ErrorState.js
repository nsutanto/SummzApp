import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  retryText = 'Retry',
  showRetry = true,
  style,
  messageStyle,
  buttonStyle,
  buttonTextStyle
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.errorText, messageStyle]}>{message}</Text>
      {showRetry && onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, buttonStyle]} 
          onPress={onRetry}
        >
          <Text style={[styles.retryText, buttonTextStyle]}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorState;
