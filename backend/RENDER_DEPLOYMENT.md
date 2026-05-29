# 🚀 Deploying to Render.com

This guide will help you deploy the PG78 Birthday Notifications backend to **Render.com** (free tier available!).

## 📋 Prerequisites

- GitHub account with PG78HUB-REBORN repository pushed
- Render.com account (free signup at https://render.com)
- VAPID keys (generate with `npm run generate-keys` locally)

## 🎯 Quick Deployment (10 minutes)

### Step 1: Connect GitHub to Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect Repository"**
4. Search for `PG78HUB-REBORN`
5. Click **"Connect"**

### Step 2: Configure Deployment Settings

| Field | Value |
|-------|-------|
| **Name** | `pg78-birthday-notifications` |
| **Runtime** | Node |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Region** | Choose closest to you |
| **Plan** | Free (or Starter if you want 24/7) |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
VAPID_EMAIL=mailto:admin@pg78calendar.com
NODE_ENV=production
FRONTEND_URL=https://jonibak2.github.io
PORT=10000
```

**⚠️ IMPORTANT:** 
- Replace `YOUR_PUBLIC_KEY_HERE` and `YOUR_PRIVATE_KEY_HERE` with your actual VAPID keys
- To generate: Run `npm run generate-keys` locally and copy the keys

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (~2 minutes)
3. You'll get a URL like: `https://pg78-birthday-notifications.onrender.com`

### Step 5: Test Your Deployment

```bash
# Check if backend is running
curl https://pg78-birthday-notifications.onrender.com/api/health

# Should return: {"status":"OK","uptime":...}
```

### Step 6: Update Frontend

Update `pages/pgCALENDAR/calendar_script.js`:

```javascript
// Change this:
const BACKEND_URL = 'http://localhost:3000';

// To your Render URL:
const BACKEND_URL = 'https://pg78-birthday-notifications.onrender.com';
```

## 🔐 How to Get VAPID Keys

1. Open terminal in your `backend/` directory
2. Run: `npm run generate-keys`
3. You'll see output like:

```
Generated VAPID Keys:
Public Key: BCk...xyz
Private Key: abc...123
```

4. Copy these into Render environment variables

## 📊 How to Monitor Your Deployment

### View Logs
In Render dashboard → Your service → **"Logs"** tab

### Check Status
```bash
curl https://YOUR_RENDER_URL.onrender.com/api/stats
```

### Test Notifications
```bash
curl -X POST https://YOUR_RENDER_URL.onrender.com/api/send-test
```

## ⚙️ Troubleshooting

### ❌ Error: "Couldn't find package.json"
**Solution:** Already fixed! We added `render.yaml` config file.

### ❌ Error: "VAPID keys not found"
**Solution:** Make sure environment variables are set correctly in Render dashboard

### ❌ Error: "CORS error" or "Origin not allowed"
**Solution:** Update `FRONTEND_URL` in Render environment variables to match your frontend domain

### ❌ Notifications not arriving
**Solution:** Check `/api/stats` to verify subscriptions are registered:
```bash
curl https://YOUR_RENDER_URL.onrender.com/api/stats
```

### ❌ Build fails with "Module not found"
**Solution:** Make sure `backend/package.json` exists and has all dependencies. Rebuild:
1. In Render dashboard, click **"Deploys"**
2. Click the three dots on latest deploy
3. Select **"Redeploy"**

## 🎨 Optional: Custom Domain

Render allows connecting custom domains on paid plans. To use your domain:

1. Go to Service → **"Settings"**
2. Scroll to **"Custom Domains"**
3. Add your domain and follow DNS setup

## 📈 Upgrading from Free

The free tier will **sleep** after 15 minutes of inactivity. To keep it always running:

1. Go to Service → **"Settings"**
2. Change **"Plan Type"** to **"Starter"** ($7/month)
3. This gives 24/7 uptime

## 📞 Support

- Render Docs: https://render.com/docs
- Backend Setup Guide: `backend/README.md`
- General Troubleshooting: `NOTIFICATIONS_SETUP.md`

## ✅ Verification Checklist

- [x] GitHub repository connected
- [x] Build command: `cd backend && npm install`
- [x] Start command: `cd backend && npm start`
- [x] VAPID_PUBLIC_KEY set
- [x] VAPID_PRIVATE_KEY set
- [x] FRONTEND_URL set to your frontend domain
- [x] NODE_ENV = production
- [x] Deployment successful
- [x] `/api/health` returns OK
- [x] Frontend BACKEND_URL updated
- [x] Test notification works

---

**Estimated Time:** 10-15 minutes
**Cost:** Free (with limitations) or $7/month for 24/7 uptime
**Next Step:** Follow Step 1 above!
