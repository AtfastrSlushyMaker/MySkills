# Railway Website Deployment Guide

## Step-by-Step Deployment via Railway Website

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with all the configuration files we created.

### 2. Deploy on Railway Website

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "Start a New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your MySkills repository**

### 3. Add MySQL Database

1. **In your project dashboard, click "New Service"**
2. **Select "Database" → "MySQL"**
3. **Wait for the database to be provisioned**

### 4. Configure Environment Variables

Click on your **web service** (not the database), then go to **"Variables"** tab and add:

```
APP_NAME=MySkills Learning Platform
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_THIS_KEY
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

**To generate APP_KEY:**

- You can use an online Laravel key generator
- Or temporarily set it to any 32-character string, then regenerate it after deployment

### 5. Database Variables (Automatic)

Railway automatically provides these when you add MySQL:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

No need to set these manually!

### 6. Custom Start Command (Optional)

In your web service settings → "Settings" tab → "Deploy":

- The start command should be automatically detected from `railway.json`
- If not, set it to: `cd backend && php artisan serve --host=0.0.0.0 --port=$PORT`

### 7. Deploy

1. **Click "Deploy"** or push changes to trigger auto-deployment
2. **Wait for the build to complete** (this may take 5-10 minutes)
3. **Check the deployment logs** for any errors

### 8. Post-Deployment Tasks

Once deployed, you can run commands via Railway's web interface:

1. **Go to your web service dashboard**
2. **Click on "..." menu → "Command Line"**
3. **Run these commands one by one:**

```bash
# Generate proper application key
php artisan key:generate --force

# Run database migrations
php artisan migrate --force

# Clear and cache config
php artisan config:clear
php artisan config:cache
```

### 9. Create Admin User (Optional)

In the Railway command line interface:

```bash
php artisan tinker
```

Then run:

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@yourdomain.com',
    'password' => \Hash::make('your-secure-password'),
    'role' => 'admin',
    'status' => 'active'
]);
```

### 10. Test Your Application

1. **Get your app URL** from Railway dashboard
2. **Visit the URL** - you should see your React frontend
3. **Test API endpoints** by visiting `your-url.railway.app/api/test`

## Troubleshooting

### Build Fails

- Check the **"Deployments"** tab for detailed logs
- Ensure all files are committed to GitHub
- Verify Dockerfile syntax

### Database Connection Issues

- Ensure MySQL service is running (green status)
- Check that environment variables are properly set
- Verify the database service is in the same project

### Frontend Not Loading

- Check if the build completed successfully in logs
- Ensure the Dockerfile is copying frontend assets correctly
- Verify the Apache configuration is working

### Laravel Errors

- Check application logs in Railway dashboard
- Ensure APP_KEY is properly generated
- Verify database migrations ran successfully

## Expected Build Process

1. **Frontend Build**: Node.js builds your React app
2. **Backend Setup**: Composer installs PHP dependencies  
3. **Asset Copying**: Frontend build files copied to Laravel public directory
4. **Laravel Optimization**: Config, routes, and views cached
5. **Service Start**: Apache serves both frontend and API

Your app should be live at: `https://your-project-name-production.up.railway.app`

## Key Benefits of This Setup

- ✅ Single service (cost-effective)
- ✅ Automatic deployments on git push
- ✅ Built-in MySQL database
- ✅ HTTPS enabled by default
- ✅ Environment variable management
- ✅ Easy scaling and monitoring
