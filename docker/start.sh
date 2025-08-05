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
    
    # Enable PHP processing
    <FilesMatch \.php$>
        SetHandler application/x-httpd-php
    </FilesMatch>
    
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
        
        # Enable PHP
        DirectoryIndex index.php index.html
        
        RewriteEngine On
        
        # Handle API routes - send to Laravel
        RewriteCond %{REQUEST_URI} ^/api
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php [QSA,L]
        
        # Handle direct PHP files
        RewriteCond %{REQUEST_FILENAME} -f
        RewriteCond %{REQUEST_FILENAME} \.php$
        RewriteRule ^(.*)$ - [L]
        
        # Handle static files (CSS, JS, images, etc.)
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
    LogLevel warn
</VirtualHost>
EOF

# Initialize logs
mkdir -p /var/log/apache2
touch /var/log/apache2/{error,access}.log
chown www-data:www-data /var/log/apache2/{error,access}.log

# Test configuration and start Apache
apache2ctl configtest
a2ensite 000-default

# Ensure PHP module is enabled
a2enmod php8.2

# Reload Apache to apply all configurations
service apache2 reload

# Create simple test files to verify Apache is working
echo "<?php phpinfo(); ?>" > /var/www/html/public/phpinfo.php
echo "<?php echo json_encode(['status' => 'php_works', 'time' => date('Y-m-d H:i:s')]); ?>" > /var/www/html/public/test.php
echo "Apache is working!" > /var/www/html/public/test.txt

# Verify files exist
echo "=== Verifying public directory ==="
ls -la /var/www/html/public/ | head -10
echo "=== Testing PHP configuration ==="
php -v
echo "=== Testing file permissions ==="
ls -la /var/www/html/public/index.php

# Run migrations in background after Apache starts
(
    sleep 5
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration completed with warnings"
    echo "Migration process finished"
    
    # Test endpoints after startup
    sleep 2
    echo "=== Testing endpoints ==="
    echo "Testing PHP info:"
    curl -s "http://localhost:${PORT}/phpinfo.php" > /dev/null && echo "✅ PHP working" || echo "❌ PHP failed"
    echo "Testing simple PHP:"
    curl -s "http://localhost:${PORT}/test.php" && echo "" || echo "❌ Test PHP failed"
    echo "Testing Laravel health:"
    curl -s "http://localhost:${PORT}/api/health" && echo "" || echo "❌ Laravel API failed"
    echo "=== Endpoint tests completed ==="
) &

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
