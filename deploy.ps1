# PowerShell deployment script for Windows
Write-Host "Building and deploying MySkills..." -ForegroundColor Green

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Working from: $(Get-Location)" -ForegroundColor Yellow

try {
    # Clean and build frontend
    Write-Host "Building frontend..." -ForegroundColor Cyan
    Set-Location frontend
    
    # Stop any running Node processes
    Write-Host "Stopping any running Node processes..."
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process esbuild -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Clean if esbuild is locked
    if (Test-Path "node_modules/@esbuild/win32-x64/esbuild.exe") {
        Write-Host "Cleaning node_modules to resolve esbuild lock..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Remove-Item package-lock.json -ErrorAction SilentlyContinue
    }
    
    # Fresh install and build
    npm install
    npm run build
    
    Set-Location ..
    
    # Install backend dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    composer install --optimize-autoloader
    Set-Location ..
    
    # Copy frontend build to backend public
    Write-Host "Merging frontend with backend..." -ForegroundColor Cyan
    if (Test-Path "frontend/dist") {
        # Backup Laravel files
        if (Test-Path "backend/public/index.php") {
            Copy-Item "backend/public/index.php" "backend/public/index.php.bak" -ErrorAction SilentlyContinue
        }
        
        # Copy frontend files
        Copy-Item "frontend/dist/*" "backend/public/" -Recurse -Force
        
        # Restore Laravel index.php if overwritten
        if (Test-Path "backend/public/index.php.bak") {
            Copy-Item "backend/public/index.php.bak" "backend/public/index.php" -Force
            Remove-Item "backend/public/index.php.bak"
        }
    } else {
        Write-Host "❌ Frontend build directory not found!" -ForegroundColor Red
        exit 1
    }
    
    # Run Laravel setup
    Write-Host "Running Laravel setup..." -ForegroundColor Cyan
    Set-Location backend
    
    # Create .env if needed
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..."
        Copy-Item ".env.example" ".env"
        php artisan key:generate
    }
    
    # Run Laravel commands
    php artisan migrate
    php artisan config:cache
    php artisan route:cache
    
    Set-Location ..
    
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Frontend built and merged with Laravel backend" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
