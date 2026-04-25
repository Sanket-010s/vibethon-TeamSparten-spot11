# 🚀 Deploy Backend to Render

## 📋 Prerequisites
- GitHub account
- Render account (free tier available)
- Firebase Admin Service Account JSON
- OpenAI API Key (optional)

## 🔧 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Push your backend code to GitHub:
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. **Create Render Web Service**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the backend repository

### 3. **Configure Build Settings**

**Basic Settings:**
- **Name**: `aiml-nexus-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (or `backend` if in monorepo)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** tier (or paid for better performance)

### 4. **Set Environment Variables**

Click **"Environment"** tab and add:

#### Required Variables:

**PORT** (Auto-set by Render)
```
10000
```

**NODE_ENV**
```
production
```

**FRONTEND_URL** (Your deployed frontend URL)
```
https://your-frontend-app.vercel.app
```

#### Firebase Admin (Required for Auth):

**FIREBASE_SERVICE_ACCOUNT**
```json
{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**How to get Firebase Service Account:**
1. Go to Firebase Console → Project Settings
2. Service Accounts tab
3. Click "Generate New Private Key"
4. Copy the entire JSON content
5. Paste as single line (remove line breaks)

#### OpenAI (Optional - for AI Tutor):

**OPENAI_API_KEY**
```
sk-...your-openai-key...
```

### 5. **Deploy**

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait for deployment (2-5 minutes)

### 6. **Get Your Backend URL**

After deployment, you'll get a URL like:
```
https://aiml-nexus-backend.onrender.com
```

### 7. **Update Frontend**

Update your frontend `.env.local`:
```env
REACT_APP_API_URL=https://aiml-nexus-backend.onrender.com
```

### 8. **Test Your API**

Test the health endpoint:
```bash
curl https://aiml-nexus-backend.onrender.com/health
```

Expected response:
```json
{"status":"ok"}
```

## 🔄 Auto-Deploy Setup

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

## 📊 Monitor Your Service

**Render Dashboard:**
- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment history
- View environment variables

## ⚠️ Important Notes

### Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### Cold Start Solution:
Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 14 minutes:
```
https://aiml-nexus-backend.onrender.com/health
```

### CORS Configuration:
Make sure `FRONTEND_URL` matches your deployed frontend exactly:
- ✅ `https://your-app.vercel.app`
- ❌ `https://your-app.vercel.app/` (no trailing slash)

## 🐛 Troubleshooting

### Build Fails:
- Check Node version in `package.json` engines
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

### Service Won't Start:
- Check environment variables are set correctly
- Verify `PORT` is using `process.env.PORT`
- Check start command is `npm start`

### CORS Errors:
- Verify `FRONTEND_URL` is correct
- Check frontend is using correct backend URL
- Ensure no trailing slashes

### Firebase Auth Fails:
- Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON
- Check service account has correct permissions
- Ensure no line breaks in JSON string

## 📝 Environment Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (auto-set by Render)
- [ ] `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] `FIREBASE_SERVICE_ACCOUNT={...}` (single line JSON)
- [ ] `OPENAI_API_KEY=sk-...` (optional)

## 🎯 Post-Deployment

1. Test all API endpoints
2. Verify Firebase authentication works
3. Check AI Tutor functionality (if OpenAI key added)
4. Monitor logs for errors
5. Set up uptime monitoring

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Firebase Admin Setup](https://firebase.google.com/docs/admin/setup)

---

**Your backend is now live on Render!** 🚀
