#!/bin/bash

# Santhe Agriculture Platform - Docker Deployment Script
# This script builds and deploys the application using Docker

set -e

echo "🚀 Santhe Agriculture Platform - Docker Deployment"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📋 Please copy .env.example to .env and configure your environment variables:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Parse command line arguments
ENVIRONMENT=${1:-development}
ACTION=${2:-up}

echo "🔧 Environment: $ENVIRONMENT"
echo "🎯 Action: $ACTION"
echo ""

# Function to deploy development environment
deploy_dev() {
    echo "📦 Building and starting development environment..."
    docker-compose down
    docker-compose build
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for services to be healthy..."
    sleep 10
    
    echo ""
    echo "✅ Development environment is running!"
    echo "🌐 Application: http://localhost:5000"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "📊 View logs: docker-compose logs -f"
    echo "🛑 Stop: docker-compose down"
}

# Function to deploy production environment
deploy_prod() {
    echo "📦 Building and starting production environment..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
    
    echo ""
    echo "⏳ Waiting for services to be healthy..."
    sleep 15
    
    echo ""
    echo "✅ Production environment is running!"
    echo "🌐 Application: http://localhost:5000"
    echo "🔒 HTTPS: https://localhost (if SSL configured)"
    echo ""
    echo "📊 View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "🛑 Stop: docker-compose -f docker-compose.prod.yml down"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    echo "✅ Services stopped"
}

# Function to view logs
view_logs() {
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Execute based on action
case $ACTION in
    up|start)
        if [ "$ENVIRONMENT" = "production" ]; then
            deploy_prod
        else
            deploy_dev
        fi
        ;;
    down|stop)
        stop_services
        ;;
    logs)
        view_logs
        ;;
    restart)
        stop_services
        sleep 2
        if [ "$ENVIRONMENT" = "production" ]; then
            deploy_prod
        else
            deploy_dev
        fi
        ;;
    *)
        echo "❌ Unknown action: $ACTION"
        echo ""
        echo "Usage: ./docker-deploy.sh [environment] [action]"
        echo ""
        echo "Environments:"
        echo "  development (default) - Use local PostgreSQL"
        echo "  production           - Use Neon Cloud PostgreSQL"
        echo ""
        echo "Actions:"
        echo "  up/start   - Build and start services"
        echo "  down/stop  - Stop services"
        echo "  restart    - Restart services"
        echo "  logs       - View logs"
        echo ""
        echo "Examples:"
        echo "  ./docker-deploy.sh development up"
        echo "  ./docker-deploy.sh production up"
        echo "  ./docker-deploy.sh development logs"
        echo "  ./docker-deploy.sh production down"
        exit 1
        ;;
esac
