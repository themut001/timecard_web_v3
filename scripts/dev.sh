#!/bin/bash

echo "🚀 Starting TimeCard Web v3 Development Environment"
echo "==================================================="

# Check if services are already running
if docker-compose ps | grep -q "Up"; then
    echo "⚠️  Services are already running."
    read -p "Do you want to restart them? (y/N): " restart
    if [[ $restart == "y" || $restart == "Y" ]]; then
        docker-compose down
    else
        echo "ℹ️  Use 'docker-compose logs -f' to view logs"
        exit 0
    fi
fi

# Start development environment
echo "🏗️  Starting development services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 5

# Show status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎯 Development URLs:"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:5000"
echo "   🏥 Health Check: http://localhost:5000/health"
echo "   🗄️  Database: postgres://postgres:password@localhost:5432/timecard_db"

echo ""
echo "📝 Useful commands:"
echo "   📋 View logs: docker-compose logs -f [service]"
echo "   🛑 Stop: docker-compose down"
echo "   🔄 Restart: docker-compose restart [service]"
echo "   💾 Database shell: docker-compose exec db psql -U postgres -d timecard_db"
echo "   🔧 Backend shell: docker-compose exec backend sh"
echo "   🖥️  Frontend shell: docker-compose exec frontend sh"

echo ""
echo "🎉 Development environment is ready!"
echo "ℹ️  Press Ctrl+C to stop watching or use 'docker-compose down' to stop services"

# Follow logs
docker-compose logs -f