import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: () => {},
  signInWithEmail: () => {},
  signUpWithEmail: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await AuthService.signInWithGoogle();
      return result.user; // Return the user object
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const result = await AuthService.signInWithEmail(email, password);
      return result.user; // Return the user object
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const result = await AuthService.signUpWithEmail(email, password);
      return result.user; // Return the user object
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
