#!/bin/bash

# Railway deployment script
echo "Starting Railway deployment..."

# Build frontend
echo "Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader

# Copy frontend build to backend public directory
echo "Copying frontend build to backend..."
cp -r ../frontend/dist/* public/

# Run Laravel optimizations
echo "Running Laravel optimizations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

echo "Deployment completed successfully!"
