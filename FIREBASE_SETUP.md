# Firebase and Google Sign-In Setup Guide

## Overview
This guide will help you complete the Firebase and Google Sign-In setup for your SummzApp.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "SummzApp")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your support email
4. Note down the **Web client ID** (you'll need this later)

## Step 3: Add Android App to Firebase

1. In Firebase Console, click "Add app" and select Android
2. Enter package name: `com.summzapp`
3. Download the `google-services.json` file
4. Replace the placeholder file at `android/app/google-services.json` with the downloaded file

## Step 4: Add iOS App to Firebase (Optional)

1. In Firebase Console, click "Add app" and select iOS
2. Enter bundle ID: `org.reactjs.native.example.SummzApp` (or your custom bundle ID)
3. Download the `GoogleService-Info.plist` file
4. Add it to your iOS project in Xcode

## Step 5: Update Configuration

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:
   - Get these from Firebase Console → Project Settings → General → Your apps
   - Copy the config object values

```javascript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abcdef123456789",
};

// Replace with your actual Web Client ID from Firebase Console
export const GOOGLE_WEB_CLIENT_ID = "your-google-web-client-id.apps.googleusercontent.com";
```

## Step 6: Install iOS Dependencies (iOS only)

If you plan to support iOS:

```bash
cd ios
bundle exec pod install
cd ..
```

## Step 7: Test the Implementation

1. Start Metro: `npm start`
2. Run Android: `npm run android`
3. Test Google Sign-In functionality

## Features Implemented

### ✅ Google Sign-In
- One-tap Google authentication
- Automatic user profile retrieval
- Profile photo display

### ✅ Email/Password Authentication
- Traditional email/password sign-in
- User registration support
- Form validation

### ✅ Authentication State Management
- React Context for global auth state
- Automatic user session persistence
- Loading states and error handling

### ✅ User Interface
- Modern, responsive login screen
- User profile display on main screen
- Logout functionality with confirmation

### ✅ Security Features
- Firebase Authentication integration
- Secure token management
- Automatic session handling

## Troubleshooting

### Common Issues:

1. **"Google Sign-In Error"**
   - Ensure `google-services.json` is correctly placed
   - Verify package name matches Firebase configuration
   - Check that Google Sign-In is enabled in Firebase Console

2. **"Firebase not initialized"**
   - Verify Firebase config values are correct
   - Ensure `@react-native-firebase/app` is properly installed

3. **Build errors**
   - Run `npx react-native clean` and rebuild
   - Ensure all dependencies are installed

## Next Steps

After completing the setup:

1. Customize the UI to match your app's design
2. Add additional authentication providers (Facebook, Apple, etc.)
3. Implement user profile management
4. Add Firebase Firestore for data storage
5. Set up push notifications

## Security Notes

- Never commit actual Firebase config to version control for production apps
- Use environment variables for sensitive configuration
- Enable App Check for additional security
- Implement proper security rules in Firebase

## Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Review React Native Firebase documentation
3. Check Google Sign-In troubleshooting guides
