#!/bin/bash

# Deploy script for LapigEscola production environment
set -e

echo "🚀 Starting deployment process..."

# Build and deploy with docker-compose
echo "📦 Building and starting services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T web python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
docker-compose -f docker-compose.prod.yml exec -T web python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "👤 Checking for superuser..."
docker-compose -f docker-compose.prod.yml exec -T web python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print('No superuser found. Please create one manually with: docker-compose -f docker-compose.prod.yml exec web python manage.py createsuperuser')
else:
    print('Superuser already exists.')
"

# Check if services are healthy
echo "🔍 Checking service health..."
if curl -f http://localhost/health/ > /dev/null 2>&1; then
    echo "✅ Application is healthy and running!"
    echo "🌐 Access your application at: http://localhost"
    echo "🔧 Admin panel: http://localhost/admin/"
else
    echo "❌ Health check failed. Please check the logs:"
    echo "docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"