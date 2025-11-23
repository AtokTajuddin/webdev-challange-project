#!/bin/bash
# Simple Docker Run Script for ChainPub
# Works with Docker CLI (no Docker Desktop needed)

echo "🚀 Starting ChainPub with Docker..."
echo ""

# Check if Docker is available
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker is not installed or not in PATH"
    echo ""
    echo "Please install Docker Engine:"
    echo "  https://docs.docker.com/engine/install/"
    exit 1
fi
echo "✓ Docker CLI is available"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
fi

# Build and start containers
echo ""
echo "📦 Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ ChainPub is starting!"
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 15
    
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:3000"
    echo "   MongoDB:  mongodb://localhost:27017"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop:         docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo ""
else
    echo ""
    echo "✗ Failed to start containers"
    echo "Check the error messages above"
    exit 1
fi
