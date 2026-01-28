# Deployment Guide - Chat App on Vercel

This guide walks you through deploying your chat application to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier works)
- Git repository pushed to GitHub/GitLab/Bitbucket
- Node.js installed locally

## 🏗️ Architecture Overview

Your app consists of two separate projects:

```
┌─────────────────────┐         ┌──────────────────────┐
│   Frontend (Client) │────────►│  Backend (Server)    │
│   Vite + React      │  API    │  Express + MongoDB   │
│   Vercel Project 1  │ Calls   │  Vercel Project 2    │
└─────────────────────┘         └──────────────────────┘
```

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard (Recommended for Beginners)

#### Step 1: Deploy the Backend (Server)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Project Name**: `chat-app-server` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `server` ← **IMPORTANT: Click "Edit" and select the server folder**
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables (click "Environment Variables"):
   ```
   MONGODB_URI=mongodb+srv://greatstack:greatstack2007@cluster0.4y9plrc.mongodb.net
   JWT_SECRET=harsh@2007
   CLOUDINARY_CLOUD_NAME=dlrz7kh8p
   CLOUDINARY_API_KEY=489894557729525
   CLOUDINARY_API_SECRET=TnMe-M-oomKJwu8hB36wwV9Q5v4
   NODE_ENV=production
   ```

6. Click **"Deploy"**
7. **Copy the deployment URL** (e.g., `https://chat-app-server.vercel.app`)

#### Step 2: Deploy the Frontend (Client)

1. Go back to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"** again
3. Import the **same Git repository**
4. Configure the project:
   - **Project Name**: `chat-app-client` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `client` ← **IMPORTANT: Click "Edit" and select the client folder**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   ```
   VITE_BACKEND_URL=https://your-server-url.vercel.app
   ```
   ⚠️ **Replace with your actual backend URL from Step 1**

6. Click **"Deploy"**
7. Visit your deployed frontend URL!

---

### Method 2: Vercel CLI (For Advanced Users)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy the Server

```bash
cd /Users/harsh/Desktop/Project/chat-app/server
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → `chat-app-server`
- **Directory?** → `./` (current directory)
- **Override settings?** → No

After deployment completes, add environment variables:

```bash
vercel env add MONGODB_URI
# Paste: mongodb+srv://greatstack:greatstack2007@cluster0.4y9plrc.mongodb.net
# Select: Production

vercel env add JWT_SECRET
# Paste: harsh@2007
# Select: Production

vercel env add CLOUDINARY_CLOUD_NAME
# Paste: dlrz7kh8p
# Select: Production

vercel env add CLOUDINARY_API_KEY
# Paste: 489894557729525
# Select: Production

vercel env add CLOUDINARY_API_SECRET
# Paste: TnMe-M-oomKJwu8hB36wwV9Q5v4
# Select: Production

vercel env add NODE_ENV
# Paste: production
# Select: Production
```

Redeploy to apply environment variables:

```bash
vercel --prod
```

**Copy the production URL** (e.g., `https://chat-app-server.vercel.app`)

#### Step 4: Deploy the Client

```bash
cd /Users/harsh/Desktop/Project/chat-app/client
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → `chat-app-client`
- **Directory?** → `./` (current directory)
- **Override settings?** → No

Add the backend URL environment variable:

```bash
vercel env add VITE_BACKEND_URL
# Paste your server URL: https://chat-app-server.vercel.app
# Select: Production
```

Redeploy to production:

```bash
vercel --prod
```

---

## ✅ Verification Checklist

After deployment, test the following:

- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Can send text messages
- [ ] Can send image messages
- [ ] Images upload to Cloudinary
- [ ] Messages persist (stored in MongoDB)
- [ ] JWT authentication works
- [ ] No console errors in browser DevTools
- [ ] Check Vercel logs for backend errors

## 🔍 Troubleshooting

### Frontend shows "Network Error" or "Failed to fetch"

**Cause**: Backend URL is incorrect or CORS issue

**Fix**:
1. Verify `VITE_BACKEND_URL` in Vercel dashboard matches your backend URL
2. Ensure backend URL doesn't have trailing slash
3. Check backend CORS settings in `server.js` (should allow all origins with `cors()`)

### Backend shows "FUNCTION_INVOCATION_FAILED"

**Cause**: Serverless function crashed

**Fix**:
1. Check Vercel logs for the server project
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Check that `NODE_ENV=production` is set

### Images not uploading

**Cause**: Cloudinary credentials incorrect

**Fix**:
1. Verify Cloudinary environment variables in Vercel dashboard
2. Check Cloudinary dashboard for API key validity
3. Ensure image size is under 4MB (set in `server.js`)

### Messages not showing in real-time

**Expected Behavior**: This is normal! Socket.IO is disabled in production.

**Workaround**: Users need to refresh the page to see new messages.

**Permanent Fix**: Deploy Socket.IO to a separate service (Railway, Render) - see [error analysis document](file:///Users/harsh/.gemini/antigravity/brain/2d9c661c-cf70-49a0-8a68-87bf2b146443/vercel_error_analysis.md) for details.

## 📊 Monitoring

- **Frontend Logs**: Vercel Dashboard → Your Client Project → Logs
- **Backend Logs**: Vercel Dashboard → Your Server Project → Logs
- **MongoDB**: Check MongoDB Atlas dashboard for connection issues
- **Cloudinary**: Check Cloudinary dashboard for upload statistics

## 🔄 Updating Your Deployment

### Automatic Deployments (Recommended)

Vercel automatically redeploys when you push to your Git repository:

```bash
git add .
git commit -m "Update chat app"
git push origin main
```

Both projects will redeploy automatically!

### Manual Redeployment via CLI

```bash
# Redeploy server
cd /Users/harsh/Desktop/Project/chat-app/server
vercel --prod

# Redeploy client
cd /Users/harsh/Desktop/Project/chat-app/client
vercel --prod
```

## 🎯 Next Steps

1. **Custom Domain**: Add a custom domain in Vercel dashboard (Settings → Domains)
2. **Real-time Features**: Consider deploying Socket.IO to Railway/Render for live chat
3. **Analytics**: Add Vercel Analytics to track usage
4. **Security**: Rotate JWT secret and API keys regularly

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Socket.IO Alternatives](file:///Users/harsh/.gemini/antigravity/brain/2d9c661c-cf70-49a0-8a68-87bf2b146443/vercel_error_analysis.md)

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review the Vercel logs for detailed error messages.
