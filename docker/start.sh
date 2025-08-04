#!/bin/bash

# Railway environment variable startup script
echo "=== Starting MySkills Application ==="
echo "Setting up environment for Railway deployment..."

# Check if required environment variables are set
echo "Checking environment variables..."
echo "MYSQL_URL: ${MYSQL_URL:-'NOT SET'}"
echo "RAILWAY_STATIC_URL: ${RAILWAY_STATIC_URL:-'NOT SET'}"

# Create .env file from environment variables
echo "Creating .env file..."
cat > .env << EOF
APP_NAME="MySkills Learning Platform"
APP_ENV=production
APP_KEY=\${APP_KEY}
APP_DEBUG=false
APP_URL=\${RAILWAY_STATIC_URL}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_URL=\${MYSQL_URL}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MAIL_MAILER=log
MAIL_HOST=localhost
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"
EOF

echo "Environment file created successfully!"
echo "Contents of .env file:"
head -10 .env

# Test database connection before proceeding
echo "Testing database connection..."
timeout 30 bash -c 'until php artisan migrate --dry-run > /dev/null 2>&1; do echo "Waiting for database..."; sleep 2; done' || {
    echo "Database connection failed after 30 seconds"
    echo "Starting Apache anyway..."
}

# Create a simple PHP info file for debugging
echo "Creating debug endpoint..."
echo '<?php echo json_encode(["status" => "php_working", "timestamp" => date("Y-m-d H:i:s")]); ?>' > /var/www/html/public/debug.php

# Run package discovery now that environment is set up
echo "Running package discovery..."
php artisan package:discover --ansi || echo "Package discovery failed, continuing..."

# Optimize autoloader
echo "Optimizing autoloader..."
composer dump-autoload --optimize || echo "Autoloader optimization failed, continuing..."

# Run Laravel optimizations
echo "Running Laravel optimizations..."
php artisan config:cache || echo "Config cache failed, continuing..."
php artisan route:cache || echo "Route cache failed, continuing..."
php artisan view:cache || echo "View cache failed, continuing..."

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

echo "=== Startup completed successfully ==="
echo "Starting Apache..."
echo "Configuring Apache for Railway PORT: ${PORT:-8080}"

# Configure Apache to listen on Railway's PORT
export PORT=${PORT:-8080}
# Update Apache ports configuration
echo "Listen ${PORT}" > /etc/apache2/ports.conf
# Update the site configuration to use the PORT variable
sed -i "s/\${PORT}/${PORT}/g" /etc/apache2/sites-available/000-default.conf

echo "Application should be available on port ${PORT}..."

# Start Apache in foreground (this is the proper way for Docker)
exec apache2-foreground
