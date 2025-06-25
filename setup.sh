#!/bin/bash

echo "🚀 TimeCard Web v3 Setup Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
    echo ""
    echo "📋 Required environment variables:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - JWT_REFRESH_SECRET"
    echo "   - NOTION_API_KEY (optional)"
    echo "   - NOTION_DATABASE_ID (optional)"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker-compose exec backend npx prisma generate

# Seed database
echo "🌱 Seeding database with sample data..."
docker-compose exec backend npm run db:seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Application URLs:"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:5000"
echo "   🏥 Health Check: http://localhost:5000/health"
echo ""
echo "👤 Demo accounts:"
echo "   🔑 Admin: admin@company.com / password123"
echo "   👨‍💼 User: user@company.com / password123"
echo ""
echo "📝 Useful commands:"
echo "   🐳 View logs: docker-compose logs -f"
echo "   🛑 Stop services: docker-compose down"
echo "   🔄 Restart: docker-compose restart"
echo ""
echo "🎯 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Login with demo credentials"
echo "   3. Configure Notion integration (optional)"
echo ""