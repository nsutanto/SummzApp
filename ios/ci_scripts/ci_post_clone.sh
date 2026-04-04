#!/bin/sh
set -e

# Xcode Cloud ci_post_clone script
# Runs after the repository is cloned to install dependencies

echo "=== Installing Node.js dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

echo "=== Installing CocoaPods dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install

echo "=== CI post-clone complete ==="
