import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/firebase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export const AuthService = {
  // Google Sign-In
  async signInWithGoogle() {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Google Sign-In');
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  // Email/Password Sign-In
  async signInWithEmail(email, password) {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  },

  // Email/Password Sign-Up
  async signUpWithEmail(email, password) {
    try {
      return await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  },

  // Sign Out
  async signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      return auth().signOut();
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  },
};
