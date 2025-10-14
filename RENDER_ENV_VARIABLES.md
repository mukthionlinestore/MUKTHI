# Render Environment Variables Configuration

## ✅ Backend (Already Deployed)
**URL**: https://mukthi-backend.onrender.com

### Environment Variables to Update on Backend:

Go to Render Dashboard → mukthi-backend → Environment

**UPDATE THIS VARIABLE:**
```
FRONTEND_URL = [Your frontend URL after deployment - update this later]
```

Current backend environment variables should have:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://mukthionlinestore_db_user:Adhil%408136@cluster0.q1hlxgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
SESSION_SECRET=your_session_secret_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:3000  ← UPDATE THIS AFTER FRONTEND DEPLOYED

# Cloudinary
CLOUDINARY_CLOUD_NAME=drimd7wtx
CLOUDINARY_API_KEY=385318261547754
CLOUDINARY_API_SECRET=jtyLl-lTgwbYXGPeK7E5ykwox3E

# Google OAuth
GOOGLE_CLIENT_ID=1097952475152-26ev4o4ueg285nh47vpor90h42dgal88.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Razorpay
RAZORPAY_KEY_ID=rzp_test_RCHfnYZOKpLybZ
RAZORPAY_KEY_SECRET=4pFIZiI6yW9KsOqZDlRgZdOg

# Email (for notifications)
EMAIL_USER=mukthionlinestore@gmail.com
EMAIL_PASS=tceq niln rfrx hoxu
```

---

## 🚀 Frontend (To Be Deployed)

### Step 1: Create Static Site on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Static Site**
3. Connect repository: `mukthionlinestore/MUKTHI`
4. Configure:
   - **Name**: `mukthi-frontend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Step 2: Add Frontend Environment Variables

In the Environment section, add these variables:

```
REACT_APP_API_URL=https://mukthi-backend.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=1097952475152-26ev4o4ueg285nh47vpor90h42dgal88.apps.googleusercontent.com
REACT_APP_RAZORPAY_KEY_ID=rzp_test_RCHfnYZOKpLybZ
```

### Step 3: Deploy

- Click **Create Static Site**
- Wait for build to complete (10-15 minutes)
- Copy your frontend URL (will be something like: `https://mukthi-frontend.onrender.com`)

---

## 🔄 Post-Frontend Deployment

### After frontend is deployed, update backend:

1. Go to Render Dashboard → **mukthi-backend** → **Environment**
2. Update `FRONTEND_URL` to your actual frontend URL
3. Click **Save Changes** (this will trigger a redeploy)

Example:
```
FRONTEND_URL=https://mukthi-frontend.onrender.com
```

---

## 🔐 Google OAuth Configuration (Important!)

After both services are deployed, update Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   - `https://mukthi-frontend.onrender.com`
   - `https://mukthi-backend.onrender.com`

4. Add to **Authorized redirect URIs**:
   - `https://mukthi-backend.onrender.com/api/auth/google/callback`
   - `https://mukthi-frontend.onrender.com`

---

## 📋 Quick Checklist

- [ ] Backend deployed at https://mukthi-backend.onrender.com ✅
- [ ] Created Static Site on Render for frontend
- [ ] Added frontend environment variables (see Step 2 above)
- [ ] Frontend deployed successfully
- [ ] Copied frontend URL
- [ ] Updated FRONTEND_URL in backend environment
- [ ] Backend redeployed with new FRONTEND_URL
- [ ] Updated Google OAuth settings
- [ ] Tested the application
- [ ] Created super admin account

---

## 🧪 Testing After Deployment

1. **Test Backend API**:
   ```
   https://mukthi-backend.onrender.com/
   ```

2. **Test Frontend**:
   - Visit your frontend URL
   - Try registering a user
   - Try logging in
   - Browse products
   - Test image uploads (admin)

---

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Check that REACT_APP_API_URL is exactly: `https://mukthi-backend.onrender.com` (no trailing slash)
- Check browser console for CORS errors
- Verify FRONTEND_URL is updated in backend

**Google OAuth not working:**
- Verify Google Cloud Console has the correct URLs
- Check that CLIENT_ID matches in both frontend and backend
- Clear browser cache and try again

**Images not uploading:**
- Check Cloudinary credentials in backend
- Verify Cloudinary account is active

---

## 📝 Notes

- Free tier backends sleep after 15 minutes of inactivity
- First request after sleep takes ~1 minute to wake up
- Static sites (frontend) are always instant
- MongoDB Atlas free tier has 512MB limit

---

## 🆘 Need Help?

Check the logs:
- **Backend**: Render Dashboard → mukthi-backend → Logs
- **Frontend**: Render Dashboard → mukthi-frontend → Events

Good luck! 🚀

