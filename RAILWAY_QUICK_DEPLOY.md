# 🚀 Railway Website Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code is committed and pushed to GitHub
- [ ] `Dockerfile` is in the root directory
- [ ] `railway.json` configuration file exists
- [ ] Environment files are configured
- [ ] Frontend builds successfully locally

## 🌐 Railway Website Steps

### 1. Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **MySkills** repository

### 2. Add Database

1. Click **"New Service"**
2. Select **"Database" → "MySQL"**
3. Wait for provisioning (green status)

### 3. Configure Web Service

Click on your **web service**, then **"Variables"** tab:

```env
APP_NAME=MySkills Learning Platform
APP_ENV=production  
APP_DEBUG=false
APP_KEY=base64:YOUR_32_CHAR_KEY_HERE
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 4. Deploy & Monitor

1. Push code or click **"Deploy"**
2. Watch build logs in **"Deployments"** tab
3. Wait for deployment to complete

### 5. Post-Deploy Commands

In Railway dashboard → Web Service → **"..."** → **"Command Line"**:

```bash
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
```

## 🎯 Expected Outcome

- ✅ Build time: ~5-10 minutes
- ✅ Your app URL: `https://[project-name]-production.up.railway.app`
- ✅ API health check: `/api/health` returns `{"status":"ok"}`
- ✅ Frontend loads correctly
- ✅ Admin can login and access dashboard

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Build fails | Check Dockerfile syntax, ensure all files committed |
| Database connection error | Verify MySQL service is running, check env vars |
| Frontend shows blank page | Check build logs, verify assets copied correctly |
| 500 errors | Generate APP_KEY, run migrations, check Laravel logs |

## 🔗 Useful Railway Links

- **Dashboard**: Your project dashboard for monitoring
- **Logs**: Real-time application logs  
- **Metrics**: Performance and usage statistics
- **Settings**: Domain, environment variables, scaling

---

**Ready to deploy?** Follow the steps above and your MySkills platform will be live! 🎉
