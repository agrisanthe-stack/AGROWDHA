#!/bin/bash

# Docker Setup Script for FarmerSanthe
set -e

echo "🚀 Setting up FarmerSanthe Docker Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating environment file from template..."
    cp .env.docker .env
    echo "✅ Environment file created. Please edit .env with your credentials."
else
    echo "✅ Environment file already exists."
fi

# Create docker directory if it doesn't exist
mkdir -p docker

echo "🏗️  Building Docker containers..."

# Build and start containers
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

$COMPOSE_CMD build

echo "🚀 Starting services..."
$COMPOSE_CMD up -d

echo "⏳ Waiting for services to be ready..."
sleep 20

# Check if services are running
echo "🔍 Checking service status..."
$COMPOSE_CMD ps

echo "✅ Setup complete!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:5000/api"
echo "   Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   View logs: $COMPOSE_CMD logs -f"
echo "   Stop services: $COMPOSE_CMD down"
echo "   Restart: $COMPOSE_CMD restart"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Edit .env with your API keys and secrets"
echo "   2. Configure Cloudinary for image uploads"
echo "   3. Set up payment gateway credentials"
echo ""