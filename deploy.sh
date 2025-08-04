#!/bin/bash

# Local development deployment script
echo "Building and deploying MySkills..."

# Build frontend
echo "Building frontend..."
cd frontend && npm ci && npm run build && cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && composer install --optimize-autoloader && cd ..

# Copy frontend build to backend public
echo "Merging frontend with backend..."
cp -r frontend/dist/* backend/public/

# Run Laravel setup
echo "Running Laravel setup..."
cd backend
php artisan migrate --force
php artisan config:cache
php artisan route:cache

echo "✅ Deployment completed!"
