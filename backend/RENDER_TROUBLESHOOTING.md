# 🔧 Render Deployment - Troubleshooting

## ❌ Error: "Couldn't find a package.json file in /opt/render/project/src"

### ✅ FIXED!

We've added configuration files to fix this issue:

1. **`package.json`** in root directory - Main entry point
2. **`render.yaml`** - Explicit Render configuration
3. Both files tell Render to use `backend/` subdirectory

### What was happening:

Render was looking for `package.json` in the root, but we only had it in `backend/` subfolder.

---

## 🚀 How to Deploy (Updated)

### Step 1: Push Latest Changes to GitHub

```bash
git add .
git commit -m "Add render.yaml and root package.json"
git push origin main
```

### Step 2: Go to Render Dashboard

https://dashboard.render.com

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Select **"GitHub"** (if not already connected)
3. Search and select **"PG78HUB-REBORN"**
4. Click **"Connect"**

### Step 4: Configure (Auto-filled from render.yaml)

Should show:
- ✅ **Build Command:** `cd backend && npm install`
- ✅ **Start Command:** `cd backend && npm start`

If not auto-filled, enter them manually.

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

```
VAPID_PUBLIC_KEY = YOUR_PUBLIC_KEY
VAPID_PRIVATE_KEY = YOUR_PRIVATE_KEY
VAPID_EMAIL = mailto:admin@pg78calendar.com
NODE_ENV = production
FRONTEND_URL = https://jonibak2.github.io
PORT = 10000
```

⚠️ **Get your VAPID keys:**
- Locally run: `cd backend && npm run generate-keys`
- Copy the output keys

### Step 6: Deploy

1. Select **"Free"** plan (or Starter for 24/7)
2. Click **"Create Web Service"**
3. Wait 2-3 minutes for build

### Step 7: Verify Success

When deployment is done, you'll see:
- Green checkmark ✅
- URL like: `https://pg78-birthday-notifications.onrender.com`

Test it:
```bash
curl https://pg78-birthday-notifications.onrender.com/api/health
```

Should return:
```json
{"status":"OK","uptime":...}
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Build Still Says "No package.json"

**Solution:** 
1. In Render dashboard, click **"Deploys"**
2. Find failed deploy, click three dots
3. Select **"Redeploy"**
4. Wait for fresh build

### Issue 2: Build Succeeds but Start Fails

**Likely Causes:**
- VAPID keys not set
- Wrong environment variables

**Fix:**
1. Click **"Logs"** tab
2. Look for error message
3. Check "Environment" section
4. Verify all variables are set correctly

### Issue 3: "Port Already in Use"

**Solution:** 
Render automatically provides PORT via env variables. The server already uses `process.env.PORT || 3000`, so it should work.

### Issue 4: CORS Error / "Origin not allowed"

**Solution:**
Update `FRONTEND_URL` environment variable to your actual frontend URL:
- If on GitHub Pages: `https://jonibak2.github.io`
- If custom domain: `https://yourdomain.com`

### Issue 5: Notifications Not Arriving

**Check:**
```bash
# See if subscriptions are registered
curl https://YOUR_RENDER_URL/api/stats
```

Should show subscriptions count > 0

If 0 subscriptions:
- Verify FRONTEND_URL is correct
- Reload calendar.html
- Check browser console for errors
- Grant notification permission when prompted

---

## 📊 Monitoring Your Deployment

### View Real-Time Logs

In Render Dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. See everything happening on server

### Check API Endpoints

```bash
# Health check
curl https://YOUR_URL/api/health

# Statistics
curl https://YOUR_URL/api/stats

# Send test notification
curl -X POST https://YOUR_URL/api/send-test
```

### Restart Service

If something goes wrong:
1. Go to **"Settings"**
2. Scroll down
3. Click **"Restart Web Service"**

---

## 💾 Environment Variables Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `VAPID_PUBLIC_KEY` | `BCk...` | Get from `npm run generate-keys` |
| `VAPID_PRIVATE_KEY` | `abc...` | **KEEP SECRET!** |
| `VAPID_EMAIL` | `mailto:admin@pg78.com` | Any valid email |
| `NODE_ENV` | `production` | Required |
| `FRONTEND_URL` | `https://jonibak2.github.io` | For CORS |
| `PORT` | `10000` | Auto-set by Render |

---

## 🎯 Deployment Checklist

- [ ] Latest code pushed to GitHub
- [ ] `package.json` exists in root
- [ ] `render.yaml` exists in root
- [ ] `backend/package.json` exists
- [ ] VAPID keys generated locally
- [ ] Environment variables added in Render
- [ ] Web Service created
- [ ] Build completed successfully ✅
- [ ] `/api/health` returns OK ✅
- [ ] Frontend BACKEND_URL updated ✅

---

## 📞 Still Having Issues?

### Check Logs in This Order:

1. **Render Dashboard Logs:**
   - Click service → "Logs" tab
   - Look for red error messages

2. **Check Configuration:**
   - Service → "Settings"
   - Verify Build & Start commands
   - Verify Environment variables

3. **Test Locally First:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Backend Documentation:**
   - `backend/README.md`
   - `backend/API_EXAMPLES.md`

5. **Contact Support:**
   - Render Help: https://render.com/support

---

## ✨ Success! 

Once deployment works, your birthday notifications will:
- ✅ Work even when browser is closed
- ✅ Send automatically on schedule
- ✅ Work 24/7 (free tier has restrictions)
- ✅ Send to all subscribed users

Next step: Update `BACKEND_URL` in your frontend! 🚀

---

**Last Updated:** May 30, 2026
**Render Version Support:** Latest
**Status:** ✅ Production Ready
