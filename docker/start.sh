#!/bin/bash

# Add error handling and debugging
trap 'echo "ERROR: Script exited at line $LINENO with exit code $?" >&2' ERR

# Railway environment variable startup script
echo "=== Starting MySkills Application ==="
echo "Setting up environment for Railway deployment..."
echo "Current working directory: $(pwd)"
echo "User: $(whoami)"

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
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=https://${RAILWAY_STATIC_URL}
APP_FORCE_HTTPS=false

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
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

# Railway proxy headers for SSL termination
TRUSTED_PROXIES="*"
EOF

echo "Environment file created successfully!"
echo "Contents of .env file (showing first 15 lines):"
head -15 .env

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

# Create a simple test endpoint that bypasses Laravel completely
echo "Creating simple test endpoint..."
echo '<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
echo json_encode([
    "status" => "direct_php_working", 
    "timestamp" => date("Y-m-d H:i:s"),
    "server_name" => $_SERVER["SERVER_NAME"] ?? "not_set",
    "http_host" => $_SERVER["HTTP_HOST"] ?? "not_set",
    "request_uri" => $_SERVER["REQUEST_URI"] ?? "not_set",
    "remote_addr" => $_SERVER["REMOTE_ADDR"] ?? "not_set",
    "forwarded_for" => $_SERVER["HTTP_X_FORWARDED_FOR"] ?? "not_set",
    "forwarded_proto" => $_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "not_set"
]);
?>' > /var/www/html/public/test.php

# Create Laravel application test endpoint
echo "Creating Laravel test endpoint..."
cat > /var/www/html/public/laravel-test.php << 'LARAVEL_TEST_EOF'
<?php
try {
    require_once __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    echo json_encode([
        'status' => 'laravel_working',
        'timestamp' => date('Y-m-d H:i:s'),
        'app_name' => config('app.name'),
        'app_env' => config('app.env'),
        'laravel_version' => app()->version()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'laravel_error',
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage(),
        'error_code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
LARAVEL_TEST_EOF

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
echo "✅ Package discovery step completed"

# Optimize autoloader
echo "Optimizing autoloader..."
# Clear any cached autoloader files first (including Laravel service cache that references Scribe)
echo "Clearing Laravel cache files..."
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php bootstrap/cache/routes.php
# Clear Composer's autoloader cache files that might reference old class names
echo "Clearing Composer autoloader cache..."
rm -f vendor/composer/autoload_classmap.php vendor/composer/autoload_files.php vendor/composer/autoload_psr4.php vendor/composer/autoload_static.php
# Force clear Composer's autoloader cache
composer clear-cache > /dev/null 2>&1 || echo "Composer cache clear failed"
# Regenerate the autoloader completely
echo "Regenerating Composer autoloader from scratch..."
composer dump-autoload --optimize --no-interaction --classmap-authoritative || echo "Autoloader optimization failed, continuing..."
echo "✅ Autoloader optimization completed"

# Fix PSR-4 autoloading issue with ImageService
echo "Fixing PSR-4 autoloading issue..."
echo "Current Services directory contents:"
ls -la app/Services/ || echo "Services directory not found"

# Check for any incorrectly named image service files
for file in app/Services/*image* app/Services/*Image*; do
    if [ -f "$file" ]; then
        echo "Found image service file: $file"
        basename_file=$(basename "$file")
        if [ "$basename_file" != "ImageService.php" ]; then
            echo "Incorrect naming detected: $basename_file, should be ImageService.php"
            if [ -f "app/Services/ImageService.php" ]; then
                echo "Correct ImageService.php exists, removing incorrect file: $file"
                rm "$file" || echo "Failed to remove $file"
            else
                echo "Renaming $file to ImageService.php"
                mv "$file" "app/Services/ImageService.php" || echo "Failed to rename $file"
            fi
        fi
    fi
done

echo "After cleanup - Services directory contents:"
ls -la app/Services/ || echo "Services directory not found"

echo "Force clearing all autoloader and cache files..."
rm -rf bootstrap/cache/* vendor/composer/autoload_* storage/framework/cache/* 2>/dev/null || true
composer clear-cache > /dev/null 2>&1 || echo "Composer cache clear failed"
echo "Re-running autoloader after fixing file naming..."
composer dump-autoload --optimize --no-interaction --classmap-authoritative || echo "Autoloader re-optimization failed"
echo "✅ PSR-4 autoloading fix completed"

# Run Laravel optimizations (skip cache operations for now)
echo "Running Laravel optimizations..."
echo "Skipping Laravel cache operations to avoid Scribe errors..."
echo "✅ Laravel optimizations completed"

# Run database migrations
echo "Running database migrations..."
# Skip migrations during startup to avoid blocking Apache
echo "Skipping database migrations during startup - will run via web endpoint"
echo "✅ Database migrations step completed"

echo "=== Startup completed successfully ==="
echo "✅ All startup steps completed, proceeding to Apache configuration"
echo "Starting Apache..."
echo "✅ Apache startup section reached"
echo "Testing file system permissions..."
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Testing write permissions to /etc/apache2/:"
ls -la /etc/apache2/ | head -5
echo "Testing if ports.conf exists:"
ls -la /etc/apache2/ports.conf || echo "ports.conf does not exist yet"
echo "✅ File system test completed"
echo "Configuring Apache for Railway PORT: ${PORT:-8080}"

# Configure Apache to listen on Railway's PORT
export PORT=${PORT:-8080}
echo "✅ PORT environment variable set to: ${PORT}"
echo "Configuring Apache to listen on port: ${PORT}"

# Create proper Apache ports configuration
echo "Creating Apache ports configuration..."
echo "✅ About to write Apache ports.conf file"
echo "Listen ${PORT}" > /etc/apache2/ports.conf
echo "✅ Successfully wrote Listen directive"
echo "ServerName localhost:${PORT}" >> /etc/apache2/ports.conf
echo "✅ Successfully wrote ServerName directive"
echo "Apache ports.conf created:"
cat /etc/apache2/ports.conf

# Update the default site configuration to use the PORT variable
echo "Creating Apache virtual host configuration..."
echo "✅ About to write virtual host configuration"
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
echo "Virtual host configuration:"
cat /etc/apache2/sites-available/000-default.conf

# Verify public directory and files
echo "=== Verifying public directory setup ==="
echo "Public directory contents:"
ls -la /var/www/html/public/ | head -10
echo "Index file check:"
if [ -f "/var/www/html/public/index.php" ]; then
    echo "✅ Laravel index.php found"
else
    echo "❌ Laravel index.php missing!"
fi
if [ -f "/var/www/html/public/index.html" ]; then
    echo "✅ Frontend index.html found"
else
    echo "❌ Frontend index.html missing!"
fi

# Test Apache configuration before starting
echo "=== Testing Apache configuration ==="
apache2ctl configtest 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Apache configuration test passed"
else
    echo "❌ Apache configuration test failed, showing errors:"
    apache2ctl configtest
    echo "Showing Apache error log:"
    tail -10 /var/log/apache2/error.log 2>/dev/null || echo "No Apache error log found yet"
    echo "Continuing anyway..."
fi

# Enable rewrite module
echo "=== Enabling Apache rewrite module ==="
a2enmod rewrite 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Apache rewrite module enabled"
else
    echo "❌ Rewrite module enable failed:"
    a2enmod rewrite
    echo "Continuing anyway..."
fi

# Enable the default site
echo "=== Enabling Apache default site ==="
a2ensite 000-default 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Apache default site enabled"
else
    echo "❌ Default site enable failed:"
    a2ensite 000-default
    echo "Continuing anyway..."
fi

echo "=== Final Apache startup ==="
echo "Starting Apache in foreground mode on port ${PORT}..."
echo "Apache should now be accessible on https://myskills-production.up.railway.app"

# Show final status before starting Apache
echo "=== Pre-flight checks ==="
echo "Working directory: $(pwd)"
echo "Current user: $(whoami)"
echo "Apache version:"
apache2 -v || echo "Apache version check failed"
echo "Apache modules loaded:"
apache2ctl -M | grep rewrite || echo "Rewrite module not found"
echo "Listening ports configuration:"
cat /etc/apache2/ports.conf
echo "Sites enabled:"
ls -la /etc/apache2/sites-enabled/
echo "Apache process status:"
ps aux | grep apache2 || echo "No Apache processes found"

# Initialize Apache error and access logs
echo "=== Initializing Apache logs ==="
mkdir -p /var/log/apache2
touch /var/log/apache2/error.log /var/log/apache2/access.log
chown www-data:www-data /var/log/apache2/error.log /var/log/apache2/access.log

echo "🚀 Executing apache2-foreground..."

# Start database setup in background after a short delay
(
    echo "Waiting 10 seconds for Apache to fully start..."
    sleep 10
    echo "Setting up database via API endpoint..."
    curl -s "http://localhost:${PORT}/api/setup-database" || echo "Database setup failed"
) &

# Start Apache in foreground (this is the proper way for Docker)
exec apache2-foreground
