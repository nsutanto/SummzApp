# Branch Protection Setup Guide

## Overview
This guide will help you set up branch protection rules to ensure all builds pass before PRs can be merged.

## 1. GitHub Branch Protection Rules

### Navigate to Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar

### Create Branch Protection Rule
1. Click **Add rule**
2. Set **Branch name pattern**: `main`
3. Configure the following settings:

#### Required Status Checks
✅ **Require status checks to pass before merging**
✅ **Require branches to be up to date before merging**

**Select these status checks:**
- `android-build` (from Android CI)
- `ios-build` (from iOS CI)

#### Additional Protection Rules
✅ **Require a pull request before merging**
✅ **Require approvals**: 1
✅ **Dismiss stale PR approvals when new commits are pushed**
✅ **Require review from code owners** (if you have CODEOWNERS file)
✅ **Restrict pushes that create files larger than 100MB**
✅ **Require conversation resolution before merging**

#### Administrator Settings
❌ **Include administrators** (recommended for team consistency)

## 2. Required Secrets for CI

### Android Build Secrets (for release builds)
If you want to build release APKs in CI, add these secrets:
- `ANDROID_KEYSTORE_BASE64`: Base64 encoded keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_ALIAS`: Key alias
- `ANDROID_KEY_PASSWORD`: Key password

### Firebase Distribution Secrets (optional)
- `FIREBASE_APP_ID`: Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON

## 3. CI Workflow Features

### ✅ What the CI Checks:

1. **Android CI** (`android-ci.yml`)
   - Builds debug APK for Android
   - Verifies all Android dependencies and React Native New Architecture
   - Generates production bundle for Android platform
   - Uploads APK and bundle artifacts for testing/debugging

2. **iOS CI** (`ios-ci.yml`)
   - Builds iOS app for simulator (no code signing required)
   - Verifies all iOS dependencies and CocoaPods installation
   - Generates production bundle for iOS platform
   - Uploads build products and bundle artifacts for testing/debugging

### ⚡ Performance Optimizations:
- **Platform-specific workflows** for parallel execution
- **Smart caching** for faster builds (Gradle, CocoaPods, npm)
- **Focused builds** - Android on Ubuntu, iOS on macOS
- **Timeout limits** to prevent hung builds
- **Artifact retention** for debugging failed builds

## 4. Setting Up the Workflow

### Step 1: Commit the CI Workflows
Two separate CI workflows are now available:
- `.github/workflows/android-ci.yml` - Android builds
- `.github/workflows/ios-ci.yml` - iOS builds

### Step 2: Test the CI
1. Create a feature branch
2. Make a small change
3. Open a Pull Request
4. Watch the CI run automatically

### Step 3: Configure Branch Protection
Follow the GitHub settings above to enforce the CI checks

## 5. Developer Workflow

### Before Creating PR:
```bash
# Run checks locally first
npm run lint
npm test
npm run android  # Test Android build
npm run ios      # Test iOS build
```

### PR Process:
1. Create feature branch from `main`
2. Make your changes
3. Push to GitHub
4. Open Pull Request
5. CI automatically runs all checks
6. Fix any failing checks
7. Get code review approval
8. Merge only after all checks pass ✅

## 6. Troubleshooting CI Failures

### Android Build Failures:
- Check Android dependencies in `android/build.gradle`
- Verify React Native New Architecture compatibility
- Look at build logs in CI artifacts

### iOS Build Failures:
- Check CocoaPods installation
- Verify iOS deployment target compatibility
- Check Xcode version requirements

### Test Failures:
- Run tests locally: `npm test`
- Check test coverage requirements
- Update snapshots if needed

### Lint Failures:
- Run locally: `npm run lint`
- Auto-fix: `npm run lint -- --fix`
- Check ESLint configuration

## 7. Optional Enhancements

### Add CODEOWNERS file:
Create `.github/CODEOWNERS`:
```
# Global owners
* @your-username

# Specific file owners
/android/ @android-expert
/ios/ @ios-expert
/src/ @frontend-team
```

### Add PR Template:
Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature  
- [ ] 💥 Breaking change
- [ ] 📝 Documentation update

## Testing
- [ ] Tested on Android
- [ ] Tested on iOS
- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
```

This setup ensures that no broken code gets merged to main! 🛡️
