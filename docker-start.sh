#!/bin/bash
# Quick Docker Start Script for ChainPub (Linux/Mac)

echo "🚀 Starting ChainPub with Docker..."
echo ""

# Check if Docker is running
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "✗ Docker is not running. Please start Docker first."
    exit 1
fi
echo "✓ Docker is running"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
fi

# Ask user if they want blockchain features
echo ""
read -p "Do you want to enable blockchain features (Anvil)? (y/N): " useBlockchain

if [[ "$useBlockchain" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔗 Starting with blockchain support..."
    docker-compose --profile blockchain up -d --build
else
    echo ""
    echo "📦 Starting without blockchain..."
    docker-compose up -d --build
fi

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✨ ChainPub is ready!"
echo ""
echo "🌐 Access the application at:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000"
echo "   MongoDB:  mongodb://localhost:27017"
if [[ "$useBlockchain" =~ ^[Yy]$ ]]; then
    echo "   Anvil:    http://localhost:8545"
fi
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop:      docker-compose down"
echo ""
