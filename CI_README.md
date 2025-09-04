# 🛡️ CI/CD Pipeline for React Native

## Overview
This project uses GitHub Actions to ensure code quality a### 🔧 Local Development Tips

1. **Always run pre-commit checks** before pushing
2. **Test on both platforms** if making native changes
3. **Update tests** when adding new features
4. **Check bundle size** for large dependency additions
5. **Use --legacy-peer-deps** for npm commands due to @rneui dependency conflicts

### 📝 Important Notes

⚠️ **npm install**: This project requires `--legacy-peer-deps` flag due to peer dependency conflicts between `@rneui/base` and `react-native-safe-area-context`. The CI workflows are configured to handle this automatically.d reliability across both Android and iOS platforms before merging to main branch.

## 🚀 Quick Start for Developers

### Before Creating a PR:
```bash
# Run all pre-commit checks
npm run pre-commit

# Or run with builds (takes longer but more thorough)
npm run pre-commit:build
```

### Available Scripts:
```bash
# Linting
npm run lint          # Check code style
npm run lint:fix      # Auto-fix lint issues

# Testing  
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Building
npm run android:build # Build Android debug APK
npm run ios:build     # Build iOS for simulator
npm run clean         # Clean build caches

# Bundling
npm run bundle:android # Generate Android bundle
npm run bundle:ios     # Generate iOS bundle
```

## 🔄 CI Pipeline Jobs

### 1. Android CI (`android-ci.yml`)
- ✅ **Platform**: Ubuntu Latest (Fast & Cost-effective)
- ✅ **Build**: Debug APK generation
- ✅ **Dependencies**: Android SDK, Java 17, Gradle caching
- ✅ **Bundle**: Production Android bundle generation
- ✅ **Artifacts**: APK and bundle for download/testing
- ✅ **Timeout**: 45 minutes

### 2. iOS CI (`ios-ci.yml`)
- ✅ **Platform**: macOS 14 (Required for iOS builds)  
- ✅ **Build**: iOS Simulator app (no code signing)
- ✅ **Dependencies**: Xcode 15.4, CocoaPods caching
- ✅ **Bundle**: Production iOS bundle generation
- ✅ **Artifacts**: Build products and bundle for download/testing
- ✅ **Timeout**: 60 minutes

## 🛡️ Branch Protection

The `main` branch is protected and requires:
- ✅ **Android CI** to pass (`android-build`)
- ✅ **iOS CI** to pass (`ios-build`)
- ✅ At least 1 code review approval
- ✅ Up-to-date branch before merging
- ✅ Conversation resolution

## 🐛 Troubleshooting CI Failures

### Android Build Issues:
```bash
# Clean and rebuild locally
cd android && ./gradlew clean && ./gradlew assembleDebug
```

### iOS Build Issues:
```bash
# Clean pods and rebuild
cd ios && rm -rf Pods Podfile.lock && pod install
```

### Test Failures:
```bash
# Run tests with verbose output
npm test -- --verbose
```

### Lint Issues:
```bash
# Auto-fix most issues
npm run lint:fix
```

## 📊 Performance & Caching

The CI pipeline includes **separate optimized workflows**:

### Android CI Optimizations:
- 📦 **npm dependencies** caching
- 🐘 **Gradle dependencies** caching (`~/.gradle/caches`)
- 🤖 **Android SDK** caching
- ⚡ **Ubuntu runner** for cost-effectiveness

### iOS CI Optimizations:
- 📦 **npm dependencies** caching  
- 🍎 **CocoaPods** caching (`~/Library/Caches/CocoaPods`)
- 🏗️ **Xcode build cache**
- ⚡ **macOS runner** only when needed

This **parallel execution** reduces total build time and improves reliability.

## 🔧 Local Development Tips

1. **Always run pre-commit checks** before pushing
2. **Test on both platforms** if making native changes
3. **Update tests** when adding new features
4. **Check bundle size** for large dependency additions
5. **Review security audit** warnings

## 📈 Metrics

Current CI performance targets:
- ⚡ **Android CI**: < 20 minutes (Ubuntu runner)
- ⚡ **iOS CI**: < 25 minutes (macOS runner)
- ⚡ **Parallel execution**: Both run simultaneously
- ⚡ **Total wall time**: ~25 minutes (limited by iOS)

## 🚨 Emergency Procedures

### Skip CI (Emergency Only):
Add `[skip ci]` to commit message:
```bash
git commit -m "Emergency hotfix [skip ci]"
```

### Rerun Failed Jobs:
- Navigate to GitHub Actions tab
- Click on failed workflow
- Click "Re-run jobs" → "Re-run failed jobs"

---

*For detailed setup instructions, see [BRANCH_PROTECTION_SETUP.md](./BRANCH_PROTECTION_SETUP.md)*
