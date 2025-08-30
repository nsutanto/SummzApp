/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Enable screens for iOS
enableScreens();

const Stack = createNativeStackNavigator();

// Component that handles conditional navigation based on auth state
function AppNavigator() {
  const { user, loading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  // Show loading screen while checking authentication state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator 
        initialRouteName={user ? "MainScreen" : "LoginScreen"}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          // User is authenticated - show main app
          <Stack.Screen 
            name="MainScreen" 
            component={MainScreen}
          />
        ) : (
          // User is not authenticated - show login
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
