# MySkills - Railway Deployment Guide

This guide will help you deploy your MySkills learning platform to Railway.

## Prerequisites

1. [Railway CLI](https://docs.railway.app/develop/cli) installed
2. Railway account
3. Git repository

## Deployment Steps

### 1. Prepare Your Project

All configuration files have been created for you:
- `Dockerfile` - Multi-stage build for production
- `railway.json` - Railway service configuration
- `package.json` - Root package file for Railway
- Environment configurations for both frontend and backend

### 2. Deploy to Railway

#### Option A: Using Railway CLI

1. **Login to Railway:**
   ```bash
   railway login
   ```

2. **Initialize Railway project:**
   ```bash
   railway init
   ```

3. **Add a MySQL database:**
   ```bash
   railway add -d mysql
   ```

4. **Set environment variables:**
   ```bash
   railway variables set APP_KEY=$(php -r "echo base64_encode(random_bytes(32));")
   railway variables set APP_ENV=production
   railway variables set APP_DEBUG=false
   railway variables set APP_NAME="MySkills Learning Platform"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

#### Option B: Using Railway Dashboard

1. **Go to [Railway Dashboard](https://railway.app/dashboard)**

2. **Create New Project > Deploy from GitHub repo**

3. **Add MySQL Database:**
   - In your project dashboard, click "Add Service"
   - Select "Database" > "MySQL"

4. **Configure Environment Variables:**
   Go to your web service settings and add:
   ```
   APP_KEY=base64:your-generated-key-here
   APP_ENV=production
   APP_DEBUG=false
   APP_NAME=MySkills Learning Platform
   APP_URL=https://your-app-name.up.railway.app
   ```
   
   The database variables (MYSQLHOST, MYSQLPORT, etc.) are automatically provided by Railway.

5. **Deploy:**
   - Railway will automatically build and deploy your application
   - The build process will use the Dockerfile

### 3. Generate Application Key

After first deployment, you may need to generate a new Laravel application key:

```bash
railway run php artisan key:generate --force
```

### 4. Run Database Migrations

```bash
railway run php artisan migrate --force
```

### 5. Access Your Application

Your application will be available at: `https://your-app-name.up.railway.app`

## Environment Variables Reference

### Required Environment Variables

Set these in Railway dashboard or via CLI:

```
APP_KEY=base64:generated-key
APP_ENV=production
APP_DEBUG=false
APP_NAME=MySkills Learning Platform
APP_URL=https://your-app-name.up.railway.app
```

### Automatic Database Variables

Railway automatically provides these when you add a MySQL service:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

## Troubleshooting

### 1. Build Failures

If the build fails, check the logs:
```bash
railway logs
```

### 2. Database Connection Issues

Ensure your MySQL service is running and connected:
```bash
railway status
```

### 3. Laravel Errors

Check Laravel-specific logs:
```bash
railway run php artisan tinker
railway run tail storage/logs/laravel.log
```

### 4. Frontend Not Loading

The frontend is served from Laravel's public directory. If assets aren't loading:
1. Check if the build completed successfully
2. Verify the Dockerfile copied frontend assets correctly

## Post-Deployment Tasks

1. **Create Admin User:**
   ```bash
   railway run php artisan tinker
   # Then in tinker:
   User::create([
       'name' => 'Admin',
       'email' => 'admin@example.com',
       'password' => Hash::make('password'),
       'role' => 'admin'
   ]);
   ```

2. **Seed Database (Optional):**
   ```bash
   railway run php artisan db:seed
   ```

## Updating Your Application

To deploy updates:

1. **Push to your GitHub repository**
2. **Railway will automatically redeploy**

Or manually trigger deployment:
```bash
railway up
```

## Custom Domain (Optional)

1. Go to your service settings in Railway dashboard
2. Go to "Networking" tab
3. Add your custom domain
4. Update your DNS settings as instructed

## Monitoring

- **View logs:** `railway logs`
- **Check status:** `railway status`
- **Access metrics:** Railway dashboard

Your MySkills platform is now ready for production use on Railway! 🚀
