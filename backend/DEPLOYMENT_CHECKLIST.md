# ✅ Render Deployment Checklist

## Before Deployment

- [ ] Push code to GitHub
- [ ] Have Firebase Service Account JSON ready
- [ ] Have OpenAI API key (optional)
- [ ] Know your frontend URL

## Render Setup

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Select Free tier

## Environment Variables

Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
OPENAI_API_KEY=sk-... (optional)
```

## After Deployment

- [ ] Wait for build to complete (2-5 min)
- [ ] Copy your Render URL
- [ ] Test: `https://your-app.onrender.com/health`
- [ ] Update frontend `.env.local` with backend URL
- [ ] Test API from frontend

## Files Changed

✅ `server.js` - Added production error handling
✅ `package.json` - Added Node version requirement
✅ `render.yaml` - Render configuration
✅ `.gitignore` - Ignore sensitive files
✅ `RENDER_DEPLOYMENT.md` - Full guide

## Your Backend URL

After deployment, you'll get:
```
https://aiml-nexus-backend-XXXX.onrender.com
```

Use this in your frontend:
```env
REACT_APP_API_URL=https://aiml-nexus-backend-XXXX.onrender.com
```

## Quick Test

```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Expected response
{"status":"ok"}
```

## Common Issues

**Build fails?**
- Check Node version matches (>=18.0.0)
- Verify all dependencies in package.json

**Service won't start?**
- Check environment variables
- Verify PORT uses process.env.PORT

**CORS errors?**
- Match FRONTEND_URL exactly (no trailing slash)
- Redeploy after changing env vars

**Cold starts?**
- Free tier spins down after 15 min
- First request takes 30-60 seconds
- Use UptimeRobot to keep alive

---

**Ready to deploy!** 🚀
