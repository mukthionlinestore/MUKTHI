# Deployment Checklist for Render

Use this checklist to ensure you don't miss any steps during deployment.

## Pre-Deployment ✅

- [ ] Code is pushed to GitHub (mukthionlinestore/MUKTHI)
- [ ] All sensitive data removed from code (no hardcoded passwords/keys)
- [ ] `.gitignore` properly configured
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account set up (for image uploads)
- [ ] Render account created (sign up at render.com)

## MongoDB Atlas Setup ✅

- [ ] Created new cluster (Free M0 tier)
- [ ] Created database user with strong password
- [ ] Saved username and password securely
- [ ] Added IP address 0.0.0.0/0 to Network Access
- [ ] Copied MongoDB connection string
- [ ] Replaced `<password>` in connection string with actual password

## Backend Deployment ✅

- [ ] Created Web Service on Render
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added all environment variables:
  - [ ] NODE_ENV=production
  - [ ] MONGODB_URI (from Atlas)
  - [ ] JWT_SECRET (random 32+ char string)
  - [ ] SESSION_SECRET (random 32+ char string)
  - [ ] PORT=10000
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
  - [ ] GOOGLE_CLIENT_ID (optional)
  - [ ] GOOGLE_CLIENT_SECRET (optional)
  - [ ] RAZORPAY_KEY_ID (optional)
  - [ ] RAZORPAY_KEY_SECRET (optional)
  - [ ] FRONTEND_URL (add after frontend deployed)
- [ ] Clicked "Create Web Service"
- [ ] Deployment successful (check logs)
- [ ] Copied backend URL

## Frontend Deployment ✅

- [ ] Created Static Site on Render
- [ ] Connected GitHub repository
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `build`
- [ ] Added environment variables:
  - [ ] REACT_APP_API_URL (backend URL from above)
  - [ ] REACT_APP_GOOGLE_CLIENT_ID
  - [ ] REACT_APP_RAZORPAY_KEY_ID
- [ ] Clicked "Create Static Site"
- [ ] Build successful (check Events)
- [ ] Copied frontend URL

## Post-Deployment ✅

- [ ] Updated FRONTEND_URL in backend environment variables with actual frontend URL
- [ ] Backend redeployed with new FRONTEND_URL
- [ ] Created super admin user via backend shell
- [ ] Tested frontend loads correctly
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested product browsing
- [ ] Tested admin login
- [ ] Tested image uploads
- [ ] Tested payment flow (if applicable)

## Google OAuth Setup (Optional) ✅

If using Google OAuth:
- [ ] Added frontend URL to Google Cloud Console authorized origins
- [ ] Added backend URL + `/api/auth/google/callback` to authorized redirect URIs
- [ ] Tested Google login on production

## Troubleshooting ✅

If something doesn't work:
- [ ] Checked backend logs on Render
- [ ] Checked frontend build logs
- [ ] Verified all environment variables are correct
- [ ] Tested backend API endpoints directly
- [ ] Checked MongoDB Atlas connection
- [ ] Verified CORS settings include frontend URL
- [ ] Checked Network tab in browser DevTools for errors

## Maintenance ✅

- [ ] Documented all environment variables securely
- [ ] Set up monitoring (optional)
- [ ] Configured custom domain (optional)
- [ ] Set up SSL (Render provides free SSL)

---

## Quick Commands

### Generate Secure Random String (PowerShell)
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Test Backend Endpoint
```
https://your-backend-url.onrender.com/api/health
```

### Push Updates to Production
```bash
git add .
git commit -m "Your message"
git push
```

---

## Important URLs

- **GitHub Repo**: https://github.com/mukthionlinestore/MUKTHI
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary**: https://cloudinary.com
- **Backend URL**: _____________________________________________
- **Frontend URL**: _____________________________________________

---

## Support Resources

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- React Deployment: https://create-react-app.dev/docs/deployment/

Good luck! 🚀

