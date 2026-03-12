# Summz Mobile App — Claude Instructions

# Project Overview

**App:** Summz — Blinkist-style book summary app with audio narration
**Platform:** iOS + Android (React Native CLI — NOT Expo)
**Repo:** repo-1 / `mobile-app`
**Stage:** MVP

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native CLI (not Expo) |
| Language | JavaScript (`.js`) — not TypeScript in this repo |
| Navigation | React Navigation v6 — Stack + Bottom Tabs |
| Auth | Firebase Auth via `@react-native-firebase/auth` |
| Google Sign-In | `@react-native-google-signin/google-signin` |
| Audio Playback | `react-native-track-player` |
| Icons | `react-native-vector-icons/MaterialIcons` |
| Styling | StyleSheet + custom theme system (see below) |
| State | React Context (AuthContext, ThemeProvider) — no Redux/Zustand |
| API | REST — Cloud Run backend via `ApiService` |
| Storage | No Supabase client. No AsyncStorage for data. API only. |


---

## Workflow

- When I say **"delegate to you"** or **"I'm watching"**: proceed autonomously through all steps, fix errors as they arise, and report when done.
- Always read relevant source files before suggesting or making changes.
- Prefer editing existing files over creating new ones.
- Never commit unless I explicitly ask. Never force push.
- Never push directly to 'main' branch. 
- Update Readme.md to provide steps on "how to"
- Update /doc/summz_mobile_architecture.html for high level major architecture decision
- After any session or changes is done, run both Android and iOS so that I can see the result
- Place comomon UI inside src/components


## Backend Reference

**Cloud Run Service:** `summz-backend-api`
**GCP Project:** `summzrn`
**Region:** `us-central1`
**Get live URL:**
```bash
gcloud run services describe summz-backend-api --region=us-central1 --format='value(status.url)'
```

**Firebase Project:** `summzapp`
**Bundle ID:** `com.summzlabs.summz`
