import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import ContentByCategoryScreen from '../screens/ContentByCategoryScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';
import { useAuth } from '../context/AuthContext';
import { navigationRef } from './navigationRef';

const Stack = createStackNavigator();

// Main App Stack that includes the tab navigator and detail screens
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Headers will be managed by individual screens
      }}
    >
      <Stack.Screen name="MainTabs" component={MainScreen} />
      <Stack.Screen name="ContentByCategoryScreen" component={ContentByCategoryScreen} />
      <Stack.Screen name="ContentDetailScreen" component={ContentDetailScreen} />
      <Stack.Screen
        name="AudioPlayerScreen"
        component={AudioPlayerScreen}
        options={{ headerShown: false, gestureDirection: 'vertical' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? (
        <MainStack />
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
