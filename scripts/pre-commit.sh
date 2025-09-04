#!/bin/bash

# Pre-commit check script for R# Step 2: Run linting (optional)
if [ "$1" != "--build-only" ]; then
    print_status "Running ESLint..."
    if npm run lint; then
        print_success "Linting passed!"
    else
        print_warning "Linting issues found. Consider running 'npm run lint:fix'"
    fi
fi

# Step 3: Run tests (optional)  
if [ "$1" != "--build-only" ]; then
    print_status "Running Jest tests..."
    if npm test -- --coverage --watchAll=false; then
        print_success "Tests passed!"
    else
        print_error "Tests failed. Please fix failing tests."
        exit 1
    fi
fin this before creating a PR to catch issues early

set -e

echo "🚀 Running pre-commit checks for React Native..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Step 1: Install dependencies
print_status "Installing npm dependencies..."
npm ci

# Step 2: Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed!"
else
    print_warning "Linting issues found. Consider running 'npm run lint -- --fix'"
fi

# Step 3: Run tests
print_status "Running Jest tests..."
if npm test -- --coverage --watchAll=false; then
    print_success "Tests passed!"
else
    print_error "Tests failed. Please fix failing tests."
    exit 1
fi

# Step 4: Check for security vulnerabilities (optional)
if [ "$1" != "--build-only" ]; then
    print_status "Running security audit..."
    if npm audit --audit-level=high; then
        print_success "No high-severity vulnerabilities found!"
    else
        print_warning "Security vulnerabilities detected. Consider running 'npm audit fix'"
    fi
fi

# Step 5: Build Android (if requested)
if [ "$1" = "--build-android" ] || [ "$1" = "--build-all" ]; then
    print_status "Building Android..."
    cd android
    if ./gradlew assembleDebug; then
        print_success "Android build passed!"
        cd ..
    else
        print_error "Android build failed!"
        cd ..
        exit 1
    fi
fi

# Step 6: Build iOS (if requested and on macOS)
if [ "$1" = "--build-ios" ] || [ "$1" = "--build-all" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Building iOS..."
        cd ios
        if pod install && xcodebuild -workspace SummzApp.xcworkspace -scheme SummzApp -destination 'platform=iOS Simulator,name=iPhone 15' build CODE_SIGNING_ALLOWED=NO; then
            print_success "iOS build passed!"
            cd ..
        else
            print_error "iOS build failed!"
            cd ..
            exit 1
        fi
    else
        print_warning "iOS build skipped (not on macOS)"
    fi
fi

# Step 7: Bundle analysis
print_status "Generating production bundles..."
if npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/android.bundle --sourcemap-output /tmp/android.bundle.map; then
    ANDROID_SIZE=$(du -h /tmp/android.bundle | cut -f1)
    print_success "Android bundle generated successfully (${ANDROID_SIZE})"
    rm -f /tmp/android.bundle /tmp/android.bundle.map
else
    print_error "Android bundle generation failed!"
    exit 1
fi

if npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/ios.bundle --sourcemap-output /tmp/ios.bundle.map; then
    IOS_SIZE=$(du -h /tmp/ios.bundle | cut -f1)
    print_success "iOS bundle generated successfully (${IOS_SIZE})"
    rm -f /tmp/ios.bundle /tmp/ios.bundle.map
else
    print_error "iOS bundle generation failed!"
    exit 1
fi

echo ""
echo "🎉 All pre-commit checks passed!"
echo "================================================"
print_success "Your code is ready for PR submission!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Your commit message'"
echo "3. git push origin your-branch-name"
echo "4. Create PR on GitHub"
echo ""
echo "Usage options:"
echo "  ./scripts/pre-commit.sh                 # Run basic checks + lint + test"
echo "  ./scripts/pre-commit.sh --build-only    # Skip lint/test, focus on builds"
echo "  ./scripts/pre-commit.sh --build-android # Include Android build"
echo "  ./scripts/pre-commit.sh --build-ios     # Include iOS build (macOS only)"
echo "  ./scripts/pre-commit.sh --build-all     # Include both platform builds"
