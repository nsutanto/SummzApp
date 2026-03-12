# Summz App Architecture Plan

## Goals
- Replicate the Blinist app experience (information-dense, card-based discovery, fast content preview).
- Use Supabase for the primary data store and content APIs.
- Use Firebase Auth for login and identity.

## Product Scope (MVP)
- Authentication: email/password + social (Google/Apple) via Firebase Auth.
- Content discovery: curated lists, categories, and personalized feed.
- Content detail: preview, summary, and metadata.
- Bookmarks: save items to user library.
- Settings: account, theme, and notification preferences.

## High-Level Architecture (Backend + Mobile)

### Backend
- Supabase is the system of record for all book/content data.
- Postgres stores content, categories, bookmarks, and user profiles.
- Storage hosts images and media assets.
- Edge Functions are optional for token exchange, personalization, and Google Books sync.

### Mobile
- React Native app is the only client.
- Firebase Auth handles login and identity.
- Supabase client is used for all data queries and writes.
- The app exchanges Firebase ID tokens for Supabase sessions to enforce RLS.

## How Do I Get the List of Books?
There are two supported approaches. The MVP should start with the first.

### Option A: Supabase as the source (recommended MVP)
1. Seed the `content_items` table with book data.
2. Fetch lists directly from Supabase with filters and ordering.
3. Use `content_categories` for category-based lists.

Example queries:
- Home feed: order by `published_at` desc with a limit.
- Category list: join `content_categories` and filter by `category_id`.
- Search: use `title` and `summary` search.

### Option B: Google Books API + sync (current plan)
1. Fetch books from the Google Books API (by query, subject, or popularity).
2. Normalize and write into Supabase `content_items`.
3. Rebuild lists in-app from Supabase (same as Option A).

Notes:
- Use Google Books as an ingestion source, not a direct client dependency.
- Store the Google Books volume id in `content_items` (e.g., `source_id`).

## Authentication Flow
1. User signs in with Firebase Auth.
2. App obtains Firebase ID token.
3. App exchanges token with Supabase (custom JWT or edge function) to mint a Supabase session.
4. Supabase RLS uses the mapped user id for data access.

## Data Model (Supabase)
- users
  - id (uuid, pk)
  - firebase_uid (text, unique)
  - email (text)
  - display_name (text)
  - avatar_url (text)
  - created_at (timestamp)

- categories
  - id (uuid, pk)
  - name (text)
  - slug (text)
  - icon (text)
  - order (int)

- content_items
  - id (uuid, pk)
  - title (text)
  - summary (text)
  - url (text)
  - image_url (text)
  - source (text)
  - published_at (timestamp)
  - created_at (timestamp)

- content_categories
  - content_id (uuid, fk -> content_items)
  - category_id (uuid, fk -> categories)

- bookmarks
  - id (uuid, pk)
  - user_id (uuid, fk -> users)
  - content_id (uuid, fk -> content_items)
  - created_at (timestamp)

## API & Data Access
- Supabase client is the primary data API.
- Firebase Auth is the identity provider only.
- All reads and writes go through Supabase with Row Level Security.

Suggested RPC / Edge Functions (optional):
- get_personalized_feed(user_id)
- sync_firebase_user(firebase_uid, profile)

## App Structure (Current Codebase)
- src/config
  - firebase.js (Firebase Auth config)
  - supabase.js (Supabase client)
- src/services
  - AuthService.js (Firebase Auth)
- src/utils
  - supabaseContentItems.js
  - supabaseCategories.js
  - supabaseContentCategories.js
  - supabaseUsers.js

## Screens (Targeted to Blinist UX)
- MainScreen
  - featured carousel
  - category chips
  - horizontal item lists
- ContentDetailScreen
  - hero image, summary, source link
  - save/bookmark action
- ContentByCategoryScreen
  - filtered list by category
- LoginScreen
  - Firebase Auth

## Security
- Firebase handles authentication and password/security policies.
- Supabase RLS ensures each user only accesses their data.
- Use service role key only in edge functions, never in the app.

## Realtime & Sync
- Use Supabase realtime for:
  - bookmarks updates
  - content changes for featured lists (optional)

## Observability
- Firebase Crashlytics for client errors.
- Supabase logs for API issues.

## Rollout Plan
1. Confirm Blinist UX references and core flows.
2. Finalize Supabase schema + RLS.
3. Implement Firebase Auth -> Supabase session exchange.
4. Wire screens to Supabase data.
5. Add bookmarks and user preferences.
6. Polish UX and performance.
