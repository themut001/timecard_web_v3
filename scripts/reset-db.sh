#!/bin/bash

echo "🗄️  Database Reset Script"
echo "========================"

echo "⚠️  WARNING: This will delete all data in the database!"
read -p "Are you sure you want to continue? (y/N): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

echo "🛑 Stopping services..."
docker-compose down

echo "🗑️  Removing database volume..."
docker volume rm timecard_web_v3_postgres_data 2>/dev/null || true

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "📝 Running migrations..."
docker-compose exec backend npx prisma migrate deploy

echo "🔧 Generating Prisma client..."
docker-compose exec backend npx prisma generate

echo "🌱 Seeding database..."
docker-compose exec backend npm run db:seed

echo ""
echo "✅ Database reset completed!"
echo ""
echo "👤 Demo accounts are available:"
echo "   🔑 Admin: admin@company.com / password123"
echo "   👨‍💼 User: user@company.com / password123"