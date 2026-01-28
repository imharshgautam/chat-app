# Deploy Chat App Server to Render

## Step 1: Create New Web Service

1. Go to https://dashboard.render.com/
2. Click the **"New +"** button in the top right
3. Select **"Web Service"**

## Step 2: Connect Repository

1. Click **"Build and deploy from a Git repository"**
2. Click **"Connect account"** if you haven't connected GitHub yet
3. Find and select your repository: **`imharshgautam/chat-app`**
4. Click **"Connect"**

## Step 3: Configure Service

Fill in the following settings:

### Basic Settings
- **Name**: `chat-app-server` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Instance Type
- **Free** (for testing)

## Step 4: Add Environment Variables

Click **"Advanced"** and add the following environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `NODE_ENV` | `production` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

**Note**: Copy these values from your `server/.env` file

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://chat-app-server-xxxx.onrender.com`

## Step 6: Update Frontend

After deployment completes, you need to update the frontend to use the new Render URL:

1. Open `client/src/lib/axios.js`
2. Update the `baseURL` to your Render URL
3. Commit and push changes
4. Redeploy frontend on Vercel

## Troubleshooting

- **Deployment fails**: Check the logs in Render dashboard
- **Server crashes**: Verify all environment variables are set correctly
- **CORS errors**: The server is already configured to allow all origins

---

**Your server code is ready and pushed to GitHub!** Just follow the steps above to deploy on Render.
