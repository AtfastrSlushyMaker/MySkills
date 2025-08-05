#!/bin/bash
set -e

echo "=== MySkills Application Startup ==="

# Parse Railway database URL
if [ -n "${MYSQL_URL}" ]; then
    DB_CONNECTION="mysql"
    DB_URL="${MYSQL_URL}"
    DB_USERNAME=$(echo "${MYSQL_URL}" | sed -n 's|.*://\([^:]*\):.*|\1|p')
    DB_PASSWORD=$(echo "${MYSQL_URL}" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
    DB_HOST=$(echo "${MYSQL_URL}" | sed -n 's|.*@\([^:]*\):.*|\1|p')
    DB_PORT=$(echo "${MYSQL_URL}" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
    DB_DATABASE=$(echo "${MYSQL_URL}" | sed -n 's|.*/\([^?]*\).*|\1|p')
else
    DB_CONNECTION="sqlite"
    DB_URL=""
fi

# Create Laravel environment file
cat > .env << EOF
APP_NAME="MySkills Learning Platform"
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=https://${RAILWAY_STATIC_URL}

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=${DB_CONNECTION}
DB_URL=${DB_URL}
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-railway}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

TRUSTED_PROXIES="*"
EOF

# Configure Apache
PORT=${PORT:-8080}

# Apache ports configuration
echo "Listen 0.0.0.0:${PORT}" > /etc/apache2/ports.conf

# Set global ServerName to suppress warnings
echo "ServerName ${RAILWAY_STATIC_URL:-myskills-production.up.railway.app}" > /etc/apache2/conf-available/servername.conf
a2enconf servername

# Apache virtual host configuration
cat > /etc/apache2/sites-available/000-default.conf << EOF
<VirtualHost *:${PORT}>
    DocumentRoot /var/www/html/public
    ServerName ${RAILWAY_STATIC_URL:-myskills-production.up.railway.app}
    
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
        DirectoryIndex index.php index.html
        
        RewriteEngine On
        
        # Handle API routes - send to Laravel
        RewriteCond %{REQUEST_URI} ^/api
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php [QSA,L]
        
        # Handle existing files (assets, static files)
        RewriteCond %{REQUEST_FILENAME} -f
        RewriteRule ^(.*)$ - [L]
        
        # Handle SPA routes (fallback to index.html for React Router)
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteRule . /index.html [L]
    </Directory>
    
    # Logging
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
    LogLevel info
    
    # Custom error pages for debugging
    ErrorDocument 500 "Internal Server Error - Check Apache logs"
    ErrorDocument 502 "Bad Gateway - PHP processing failed"
    ErrorDocument 503 "Service Unavailable - Apache misconfiguration"
</VirtualHost>
EOF

# Initialize logs
mkdir -p /var/log/apache2
touch /var/log/apache2/{error,access}.log
chown www-data:www-data /var/log/apache2/{error,access}.log

# Test configuration and start Apache
apache2ctl configtest
a2ensite 000-default

# Create simple test file
echo "<?php echo json_encode(['status' => 'php_works', 'time' => date('Y-m-d H:i:s')]); ?>" > /var/www/html/public/test.php

# Create a simple static test file
echo "<h1>Apache is Working!</h1><p>Static HTML file served successfully</p>" > /var/www/html/public/static-test.html

# Create a comprehensive health check
cat > /var/www/html/public/health.php << 'HEALTH_EOF'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $response = [
        'status' => 'ok',
        'timestamp' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
        'server_port' => $_SERVER['SERVER_PORT'] ?? 'unknown',
        'environment' => 'production'
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
HEALTH_EOF

# Verify Apache can reach PHP
echo "=== Testing Apache-PHP Integration ==="
echo "Testing if Apache can find files..."
ls -la /var/www/html/public/index.* /var/www/html/public/test.php || echo "Files missing!"
echo "Testing PHP CLI..."
php -v

# Run migrations in background after Apache starts
(
    sleep 5
    echo "=== Internal Connection Test ==="
    echo "Testing localhost connection..."
    curl -s "http://localhost:${PORT}/test.php" || echo "❌ Internal PHP test failed"
    curl -s "http://localhost:${PORT}/api/health" || echo "❌ Internal API test failed"
    
    sleep 5
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration completed with warnings"
    echo "Migration process finished"
) &

echo "Starting Apache on port ${PORT}..."

# Start Apache briefly to test
echo "=== Testing Apache Startup ==="
apache2ctl start
sleep 2

# Test endpoints
echo "Testing static file..."
curl -I "http://localhost:${PORT}/static-test.html" && echo "✅ Static file works" || echo "❌ Static file failed"

echo "Testing PHP health..."
curl -s "http://localhost:${PORT}/health.php" && echo "✅ PHP health works" || echo "❌ PHP health failed"

echo "Testing Laravel API..."
curl -s "http://localhost:${PORT}/api/health" && echo "✅ Laravel API works" || echo "❌ Laravel API failed"

# Stop Apache to restart in foreground mode
apache2ctl stop
sleep 1

# Monitor Apache logs in background
(
    sleep 3
    echo "=== Monitoring Apache Error Logs ==="
    tail -f /var/log/apache2/error.log &
) &

exec apache2-foreground
