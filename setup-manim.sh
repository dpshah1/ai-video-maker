#!/bin/bash

echo "🚀 Setting up Manim environment for video-maker..."

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS, installing system dependencies..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install system dependencies
    echo "📦 Installing pkg-config and cairo..."
    brew install pkg-config cairo
    
    # Install LaTeX (BasicTeX for smaller size)
    echo "📄 Installing BasicTeX..."
    brew install basictex
    
    # Update TeX Live Manager
    echo "🔄 Updating TeX Live Manager..."
    sudo tlmgr update --self
    
    # Install required LaTeX packages
    echo "📚 Installing LaTeX packages for Manim..."
    sudo tlmgr install latex-bin amsfonts amsmath geometry preview standalone xcolor ucs dvisvgm
    
    # Add TeX to PATH
    echo "🔗 Adding TeX to PATH..."
    sudo tlmgr path add
    
else
    echo "⚠️  Not on macOS. Please install the following manually:"
    echo "   - pkg-config"
    echo "   - cairo"
    echo "   - LaTeX distribution (TeX Live or MiKTeX)"
    echo "   - Required LaTeX packages"
fi

# Create Python virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python packages
echo "📦 Installing Python packages..."
pip install --upgrade pip
pip install manim moviepy sympy

echo "✅ Setup complete!"
echo ""
echo "🎬 To use Manim:"
echo "   1. Activate the virtual environment: source venv/bin/activate"
echo "   2. Run your Next.js app: npm run dev"
echo "   3. Upload PDFs and generate videos!"
echo ""
echo "📝 Note: The first time you render a video, it may take longer as Manim compiles LaTeX." 