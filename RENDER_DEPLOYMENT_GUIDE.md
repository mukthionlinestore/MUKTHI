# Render Deployment Guide

This guide will help you deploy your E-commerce application on Render.

## Overview
You need to deploy **TWO services** on Render:
1. **Backend (Node.js/Express API)** - Web Service
2. **Frontend (React)** - Static Site

---

## Prerequisites

1. GitHub account (✓ Already done - your code is on GitHub)
2. Render account - Sign up at https://render.com (use your GitHub account)
3. MongoDB Atlas account (for production database) - https://www.mongodb.com/cloud/atlas

---

## Part 1: Setup MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a **New Project** (e.g., "MUKTHI-Ecommerce")
4. Click **Build a Database**
5. Choose **FREE (M0)** tier
6. Select a cloud provider and region (closest to you)
7. Click **Create Cluster**
8. Under **Security** → **Database Access**:
   - Click "Add New Database User"
   - Create username and password (save these!)
9. Under **Security** → **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
10. Click **Connect** → **Connect your application**
11. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
12. Replace `<password>` with your actual password

---

## Part 2: Deploy Backend (API)

### Step 1: Create Backend Service on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `mukthionlinestore/MUKTHI`
4. Configure the service:

   **Basic Settings:**
   - **Name**: `mukthi-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 2: Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `MONGODB_URI` | `your-mongodb-atlas-connection-string` | From MongoDB Atlas |
| `JWT_SECRET` | `your-secure-random-string-here` | Generate a random string (min 32 chars) |
| `SESSION_SECRET` | `another-secure-random-string` | Generate another random string |
| `FRONTEND_URL` | `https://your-frontend-url.onrender.com` | Will update after frontend deployment |
| `PORT` | `10000` | Render's default port |
| `CLOUDINARY_CLOUD_NAME` | `your-cloudinary-name` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | `your-cloudinary-key` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | `your-cloudinary-secret` | From Cloudinary dashboard |
| `GOOGLE_CLIENT_ID` | `your-google-client-id` | (Optional) For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` | (Optional) For Google OAuth |
| `RAZORPAY_KEY_ID` | `your-razorpay-key` | (Optional) For payments |
| `RAZORPAY_KEY_SECRET` | `your-razorpay-secret` | (Optional) For payments |

**To generate secure secrets**, use:
```bash
# In PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Step 3: Deploy
- Click **Create Web Service**
- Wait for deployment (5-10 minutes)
- Copy your backend URL (e.g., `https://mukthi-backend.onrender.com`)

---

## Part 3: Deploy Frontend (React)

### Step 1: Update Frontend Configuration

Before deploying frontend, you need to update the API URL in your code.

1. Open `src/config/axios.js` in your project
2. Update the `baseURL` to point to your backend URL:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'https://mukthi-backend.onrender.com';
   ```

3. Commit and push this change to GitHub:
   ```bash
   git add src/config/axios.js
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Create Frontend Service on Render

1. Go to Render Dashboard
2. Click **New +** → **Static Site**
3. Connect your repository: `mukthionlinestore/MUKTHI`
4. Configure:

   **Basic Settings:**
   - **Name**: `mukthi-frontend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: (leave empty, or use `.`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Step 3: Add Frontend Environment Variables

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://mukthi-backend.onrender.com` |
| `REACT_APP_GOOGLE_CLIENT_ID` | `your-google-client-id` |
| `REACT_APP_RAZORPAY_KEY_ID` | `your-razorpay-key-id` |

### Step 4: Deploy
- Click **Create Static Site**
- Wait for build and deployment
- Copy your frontend URL (e.g., `https://mukthi-frontend.onrender.com`)

---

## Part 4: Update Backend with Frontend URL

1. Go to your Backend service on Render
2. Go to **Environment** tab
3. Update `FRONTEND_URL` with your actual frontend URL
4. Click **Save Changes** (this will redeploy the backend)

---

## Part 5: Post-Deployment Setup

### Create Super Admin

Once backend is deployed, create your super admin user:

1. In Render Backend service → **Shell** tab
2. Run:
   ```bash
   node create-superadmin.js
   ```
   Or use the endpoint if you have it set up.

### Test Your Application

1. Visit your frontend URL
2. Try to register/login
3. Test product browsing
4. Test admin panel access

---

## Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 minutes of inactivity (first request may be slow)
- **Frontend**: Always available (static files)
- **Database**: MongoDB Atlas free tier has 512MB storage limit

### Security Checklist
- ✅ Environment variables are set correctly
- ✅ MongoDB is using strong password
- ✅ JWT_SECRET is random and secure
- ✅ CORS is configured with your frontend URL
- ✅ .gitignore excludes config.env and sensitive files

### Common Issues

**Backend not connecting to database:**
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify MONGODB_URI is correct with password

**Frontend can't reach backend:**
- Check REACT_APP_API_URL is correct
- Verify CORS settings in backend include frontend URL

**Images not uploading:**
- Verify all Cloudinary credentials are correct
- Check Cloudinary dashboard for upload preset settings

---

## Monitoring & Logs

- **Backend Logs**: Render Dashboard → Your Service → Logs tab
- **Frontend Build Logs**: Render Dashboard → Your Static Site → Events tab
- **Database**: MongoDB Atlas → Cluster → Metrics

---

## Updating Your Application

When you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically detect changes and redeploy both services.

---

## Alternative: Deploy Both as Single Web Service (Advanced)

If you want to serve both frontend and backend from one service, you'll need to:
1. Build the React app
2. Serve static files from Express
3. Update server.js to serve the build folder

This is more complex but uses only one Render service. Let me know if you want this approach instead!

---

## Support

If you encounter issues:
1. Check Render logs
2. Verify all environment variables
3. Test backend endpoints directly (using Postman or browser)
4. Check MongoDB Atlas connection

Good luck with your deployment! 🚀

