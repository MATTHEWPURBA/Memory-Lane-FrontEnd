#!/bin/bash

echo "🚀 Setting up Memory Lane FrontEnd Environment..."

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file from example
echo "📝 Creating .env file from template..."
cp env.example .env

echo "✅ Environment file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file if needed (API_BASE_URL is set to http://localhost:5001/api)"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm start' to start the development server"
echo ""
echo "🔧 Current API Configuration:"
echo "   - Development: http://localhost:5001/api"
echo "   - Android Emulator: http://10.0.2.2:5001/api"
echo "   - iOS Simulator: http://localhost:5001/api"
echo ""
echo "🌐 Make sure your backend is running on port 5001!" 