import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import ContentByCategoryScreen from '../screens/ContentByCategoryScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';

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
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
