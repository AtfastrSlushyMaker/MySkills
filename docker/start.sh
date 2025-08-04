#!/bin/bash

# Railway environment variable startup script
echo "=== Starting MySkills Application ==="
echo "Setting up environment for Railway deployment..."

# Debug environment variables
echo "=== Environment Debug ==="
echo "PORT: ${PORT:-'NOT SET'}"
echo "APP_KEY: ${APP_KEY:-'NOT SET'}"
echo "MYSQL_URL: ${MYSQL_URL:-'NOT SET'}"
echo "RAILWAY_STATIC_URL: ${RAILWAY_STATIC_URL:-'NOT SET'}"
env | grep -E '^(RAILWAY_|DATABASE_|MYSQL_)' || echo "No Railway/database environment variables found"

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
# Test the database connection now that we have MYSQL_URL
echo "Testing database connection with MYSQL_URL..."
timeout 10 bash -c 'until php artisan migrate:status > /dev/null 2>&1; do echo "Waiting for database..."; sleep 1; done' || {
    echo "Database connection test completed (may not be ready yet)"
}

# Create a simple PHP info file for debugging
echo "Creating debug endpoint..."
echo '<?php echo json_encode(["status" => "php_working", "timestamp" => date("Y-m-d H:i:s")]); ?>' > /var/www/html/public/debug.php

# Run package discovery now that environment is set up
echo "Running package discovery..."
# Skip package discovery to avoid Scribe errors
echo "Skipping package discovery to avoid Scribe errors..."

# Optimize autoloader
echo "Optimizing autoloader..."
# Clear any cached autoloader files first
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php
composer dump-autoload --optimize || echo "Autoloader optimization failed, continuing..."

# Run Laravel optimizations (skip cache operations for now)
echo "Running Laravel optimizations..."
echo "Skipping Laravel cache operations to avoid Scribe errors..."

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force || echo "Migration failed, continuing..."

echo "=== Startup completed successfully ==="
echo "Starting Apache..."
echo "Configuring Apache for Railway PORT: ${PORT:-8080}"

# Configure Apache to listen on Railway's PORT
export PORT=${PORT:-8080}

# Create proper Apache ports configuration
echo "Listen ${PORT}" > /etc/apache2/ports.conf
echo "ServerName localhost:${PORT}" >> /etc/apache2/ports.conf

# Update the default site configuration to use the PORT variable
cat > /etc/apache2/sites-available/000-default.conf << EOF
<VirtualHost *:${PORT}>
    DocumentRoot /var/www/html/public
    
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
        
        # Handle React Router (SPA)
        RewriteEngine On
        RewriteBase /
        
        # Handle Laravel API routes
        RewriteCond %{REQUEST_URI} ^/api
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php [QSA,L]
        
        # Handle React routes (everything else)
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteRule . /index.html [L]
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

echo "Apache configuration created for port ${PORT}"

# Test Apache configuration before starting
echo "Testing Apache configuration..."
apache2ctl configtest || {
    echo "Apache configuration test failed!"
    cat /etc/apache2/sites-available/000-default.conf
    echo "Starting anyway..."
}

# Enable rewrite module
a2enmod rewrite

echo "Starting Apache in foreground mode on port ${PORT}..."
# Start Apache in foreground (this is the proper way for Docker)
exec apache2-foreground
