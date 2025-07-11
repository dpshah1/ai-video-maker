#!/bin/bash

echo "🎬 Setting up FFmpeg for video processing..."

# Check if FFmpeg is already installed
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg is already installed"
    ffmpeg -version | head -n 1
    exit 0
fi

# Detect operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Installing FFmpeg on Linux..."
    
    # Try different package managers
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif command -v yum &> /dev/null; then
        sudo yum install -y ffmpeg
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y ffmpeg
    elif command -v pacman &> /dev/null; then
        sudo pacman -S ffmpeg
    else
        echo "❌ Could not install FFmpeg automatically. Please install it manually."
        echo "Visit: https://ffmpeg.org/download.html"
        exit 1
    fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing FFmpeg on macOS..."
    
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "Visit: https://brew.sh"
        exit 1
    fi

elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Installing FFmpeg on Windows..."
    echo "Please download and install FFmpeg manually:"
    echo "Visit: https://ffmpeg.org/download.html"
    exit 1

else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please install FFmpeg manually:"
    echo "Visit: https://ffmpeg.org/download.html"
    exit 1
fi

# Verify installation
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg installed successfully!"
    ffmpeg -version | head -n 1
else
    echo "❌ FFmpeg installation failed"
    exit 1
fi

echo "🎉 FFmpeg setup complete!" 