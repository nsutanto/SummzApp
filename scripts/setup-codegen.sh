#!/bin/bash

echo "🔄 Running React Native Codegen..."
npx @react-native-community/cli codegen

echo "📁 Creating missing codegen directories with minimal CMakeLists.txt..."

# Create directories and minimal CMakeLists.txt files to satisfy autolinking
for lib in "@react-native-async-storage/async-storage" "@react-native-google-signin/google-signin" "react-native-gesture-handler" "react-native-vector-icons" "react-native-safe-area-context" "react-native-screens"; do
    mkdir -p "node_modules/$lib/android/build/generated/source/codegen/jni/"
    
    # Create minimal CMakeLists.txt if it doesn't exist
    if [ ! -f "node_modules/$lib/android/build/generated/source/codegen/jni/CMakeLists.txt" ]; then
        cat > "node_modules/$lib/android/build/generated/source/codegen/jni/CMakeLists.txt" << 'EOF'
# Minimal CMakeLists.txt for autolinking compatibility
cmake_minimum_required(VERSION 3.13)
# This file exists to satisfy autolinking requirements
# Actual codegen is handled centrally in android/app/build/generated/source/codegen
EOF
    fi
done

echo "✅ Codegen setup complete - using centralized codegen with minimal library stubs!"
