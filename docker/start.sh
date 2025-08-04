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

# Apache virtual host configuration
cat > /etc/apache2/sites-available/000-default.conf << EOF
<VirtualHost *:${PORT}>
    DocumentRoot /var/www/html/public
    ServerName ${RAILWAY_STATIC_URL:-myskills-production.up.railway.app}
    
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        
        # Handle API routes
        RewriteCond %{REQUEST_URI} ^/api
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php [QSA,L]
        
        # Handle existing files (assets, PHP files)
        RewriteCond %{REQUEST_FILENAME} -f
        RewriteRule ^(.*)$ - [L]
        
        # Handle SPA routes (fallback to index.html)
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteRule . /index.html [L]
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Initialize logs
mkdir -p /var/log/apache2
touch /var/log/apache2/{error,access}.log
chown www-data:www-data /var/log/apache2/{error,access}.log

# Test configuration and start Apache
apache2ctl configtest
a2ensite 000-default

# Run migrations in background after Apache starts
(
    sleep 5
    php artisan migrate --force 2>/dev/null || echo "Migration failed"
) &

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
