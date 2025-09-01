import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { spacing } from '../styles';
import { insertUserToSupabase } from '../utils/supabaseUsers';
import { useTheme } from '../hooks/useTheme';

const LoginScreen = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      
      // Insert user data to Supabase
      if (user) {
        await insertUserToSupabase({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      
      // No need to manually navigate - AuthContext will handle the state change
      // and automatically switch to MainScreen
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      let user;
      if (isSignUp) {
        user = await signUpWithEmail(email, password);
      } else {
        user = await signInWithEmail(email, password);
      }
      
      // Insert user data to Supabase
      if (user) {
        await insertUserToSupabase({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        });
      }
      
      // No need to manually navigate - AuthContext will handle the state change
      // and automatically switch to MainScreen
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>Welcome to SummzApp</Text>
      
      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[styles.googleButton, { backgroundColor: theme.primary }]} 
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
      
      <Text style={[styles.orText, { color: theme.text.secondary }]}>OR</Text>
      
      {/* Email/Password Form */}
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: theme.border.default,
            backgroundColor: theme.surface,
            color: theme.text.primary
          }
        ]}
        placeholder="Email"
        placeholderTextColor={theme.text.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: theme.border.default,
            backgroundColor: theme.surface,
            color: theme.text.primary
          }
        ]}
        placeholder="Password"
        placeholderTextColor={theme.text.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.emailButton, { backgroundColor: theme.secondary }]} 
        onPress={handleEmailAuth}
      >
        <Text style={styles.emailButtonText}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={[styles.switchButtonText, { color: theme.primary }]}>
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    width: '80%',
    backgroundColor: '#f9f9f9',
  },
  emailButton: {
    backgroundColor: '#34A853',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 10,
  },
  switchButtonText: {
    color: '#4285F4',
    fontSize: 14,
  },
});

export default LoginScreen;
