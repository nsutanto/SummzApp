# Summz Mobile App

Blinkist-style book summary app with audio narration. Built with React Native CLI (not Expo).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native CLI 0.81 |
| Language | JavaScript (`.js`) |
| Navigation | React Navigation v6 — Stack + Bottom Tabs |
| Auth | Firebase Auth (`@react-native-firebase/auth`) |
| Google Sign-In | `@react-native-google-signin/google-signin` |
| Audio | `react-native-track-player` |
| Icons | `react-native-vector-icons/MaterialIcons` |
| State | React Context (AuthContext, ThemeProvider) |
| API | REST — Cloud Run backend via `ApiService` |

---

## Prerequisites

- Node >= 18
- Ruby + Bundler (for CocoaPods)
- Xcode 15+ (iOS)
- Android Studio + SDK 36 (Android)
- JDK 17

---

## First-Time Setup

```sh
# 1. Install JS dependencies (patches apply automatically via postinstall)
npm install --legacy-peer-deps

# 2. iOS — install CocoaPods
cd ios && pod install && cd ..
```

> **Note:** `npm install` automatically applies patches in `patches/` via `patch-package`.
> These patches fix `react-native-track-player@4.1.2` compatibility with RN 0.81 New Architecture.

---

## Running the App

### Start Metro

```sh
npm start
```

### Android

```sh
npm run android
```

### iOS

```sh
npm run ios
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run android` | Build and run on Android emulator/device |
| `npm run ios` | Build and run on iOS simulator/device |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run clean` | Clean Android + iOS build artifacts |
| `npm run android:build` | Build Android debug APK |
| `npm run android:release` | Build Android release APK |
| `npm run bundle:android` | Create Android JS bundle |
| `npm run bundle:ios` | Create iOS JS bundle |

---

## Project Structure

```
src/
  components/       # Shared UI components
  context/          # AuthContext, ThemeProvider
  navigation/       # AppNavigator (Stack + Tabs)
  screens/          # Screen components
  services/         # ApiService, AudioService, AuthService
patches/
  react-native-track-player+4.1.2.patch   # New Arch compatibility fix
```

---

## Audio Infrastructure

`AudioService` (`src/services/AudioService.js`) wraps `react-native-track-player` and provides:

- `AudioService.setup()` — initializes the player (idempotent, safe to call on every mount)
- `AudioService.loadChapters(chapters, book, startIndex)` — loads a book's chapters as a queue and starts playback
- `AudioService.play/pause/seekTo/skipToNext/skipToPrevious/seekRelative()`
- `AudioService.destroy()` — tears down the player

`PlaybackService` (named export from `AudioService.js`) handles remote control events (lock screen, headphone buttons) and is registered in `index.js`.

---

## Native Patches (`patch-package`)

`react-native-track-player@4.1.2` requires two source patches to work with RN 0.81 New Architecture on Android:

1. **Kotlin null safety** — `originalItem!!` in `MusicModule.kt` (lines 548, 588)
2. **TurboModule return type** — all `@ReactMethod fun ... = scope.launch {}` expression bodies converted to block bodies so they return `Unit` instead of `Job`

Patches are in `patches/react-native-track-player+4.1.2.patch` and apply automatically on `npm install`.

---

## Backend

- **Cloud Run:** `summz-backend-api` (GCP project: `summzrn`, region: `us-central1`)
- **Firebase:** project `summzapp`, bundle ID `com.summzlabs.summz`

Get live backend URL:
```sh
gcloud run services describe summz-backend-api --region=us-central1 --format='value(status.url)'
```

---

## Troubleshooting

### Android build fails after `npm install`
Patches may not have applied. Run manually:
```sh
npx patch-package
```

### iOS pod install fails
```sh
cd ios && pod deintegrate && pod install
```

### Metro cache issues
```sh
npm start -- --reset-cache
```
