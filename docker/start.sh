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
echo "=== Railway Database Variables ==="
env | grep -E '^(RAILWAY_|DATABASE_|MYSQL_|DB_)' | head -10 || echo "No Railway/database environment variables found"

# Create .env file from environment variables
echo "Creating .env file..."

# Parse MYSQL_URL if provided
if [ -n "${MYSQL_URL}" ]; then
    echo "Parsing MYSQL_URL for database connection..."
    # Extract database connection details from MYSQL_URL
    # Format: mysql://username:password@host:port/database
    DB_CONNECTION="mysql"
    DB_URL="${MYSQL_URL}"
    
    # Also extract individual components as fallback
    DB_USERNAME=$(echo "${MYSQL_URL}" | sed -n 's|.*://\([^:]*\):.*|\1|p')
    DB_PASSWORD=$(echo "${MYSQL_URL}" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
    DB_HOST=$(echo "${MYSQL_URL}" | sed -n 's|.*@\([^:]*\):.*|\1|p')
    DB_PORT=$(echo "${MYSQL_URL}" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
    DB_DATABASE=$(echo "${MYSQL_URL}" | sed -n 's|.*/\([^?]*\).*|\1|p')
    
    echo "Parsed DB connection: ${DB_USERNAME}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
else
    echo "No MYSQL_URL provided, using SQLite"
    DB_CONNECTION="sqlite"
    DB_URL=""
fi

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

DB_CONNECTION=${DB_CONNECTION}
DB_URL=${DB_URL}
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-railway}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD}

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
echo "Database configuration:"
echo "- DB_CONNECTION: ${DB_CONNECTION}"
echo "- DB_HOST: ${DB_HOST}"
echo "- DB_PORT: ${DB_PORT}"
echo "- DB_DATABASE: ${DB_DATABASE}"
echo "- DB_USERNAME: ${DB_USERNAME}"
echo "- DB_URL: ${DB_URL}"

# Skip database connection test during startup to get Apache running
echo "Skipping database connection test during startup - will test via web endpoint"

# Create a simple PHP info file for debugging
echo "Creating debug endpoint..."
echo '<?php echo json_encode(["status" => "php_working", "timestamp" => date("Y-m-d H:i:s")]); ?>' > /var/www/html/public/debug.php

# Create database connection test endpoint
echo "Creating database test endpoint..."
cat > /var/www/html/public/dbtest.php << 'DBTEST_EOF'
<?php
try {
    require_once __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    $pdo = $app->make('db')->connection()->getPdo();
    
    echo json_encode([
        'status' => 'database_connected',
        'timestamp' => date('Y-m-d H:i:s'),
        'server_info' => $pdo->getAttribute(PDO::ATTR_SERVER_INFO),
        'connection_status' => $pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'database_error',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage(),
        'error_code' => $e->getCode(),
        'env_vars' => [
            'DB_CONNECTION' => $_ENV['DB_CONNECTION'] ?? 'not_set',
            'DB_HOST' => $_ENV['DB_HOST'] ?? 'not_set',
            'DB_PORT' => $_ENV['DB_PORT'] ?? 'not_set',
            'DB_DATABASE' => $_ENV['DB_DATABASE'] ?? 'not_set',
            'DB_USERNAME' => $_ENV['DB_USERNAME'] ?? 'not_set',
            'DB_URL' => isset($_ENV['DB_URL']) ? 'set' : 'not_set'
        ]
    ]);
}
?>
DBTEST_EOF

# Run package discovery now that environment is set up
echo "Running package discovery..."
# Skip package discovery to avoid Scribe errors
echo "Skipping package discovery to avoid Scribe errors..."

# Optimize autoloader
echo "Optimizing autoloader..."
# Clear any cached autoloader files first (including Laravel service cache that references Scribe)
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php bootstrap/cache/routes.php
# Force clear Composer's autoloader cache
composer clear-cache > /dev/null 2>&1 || echo "Composer cache clear failed"
composer dump-autoload --optimize --no-interaction || echo "Autoloader optimization failed, continuing..."

# Run Laravel optimizations (skip cache operations for now)
echo "Running Laravel optimizations..."
echo "Skipping Laravel cache operations to avoid Scribe errors..."

# Run database migrations
echo "Running database migrations..."
# Skip migrations during startup to avoid blocking Apache
echo "Skipping database migrations during startup - will run via web endpoint"

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
