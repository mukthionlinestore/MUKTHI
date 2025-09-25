# 🔐 Google OAuth Setup Guide

## ✅ Current Status
Your application is now ready for Google OAuth! The server will start without Google credentials, and you can add them later.

## 📋 Step-by-Step Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and click "Enable"

### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add these **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### Step 3: Add Environment Variables
Add these to your `backend/config.env` file:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
SESSION_SECRET=your-session-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### Step 4: Restart Your Server
```bash
cd backend
npm start
```

You should see: `✅ Google OAuth configured successfully`

## 🧪 Testing
1. Start your frontend: `npm start`
2. Go to the login page
3. Click "Continue with Google"
4. Complete the OAuth flow

## 🔧 Troubleshooting

### If you see "Google OAuth not configured":
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in your environment
- Restart the server after adding the variables

### If you get "redirect_uri_mismatch":
- Make sure the redirect URIs in Google Cloud Console match exactly
- Include both frontend and backend URLs

### If the popup doesn't open:
- Check browser console for errors
- Make sure popup blockers are disabled

## 🚀 Production Setup
For production, update the redirect URIs to your domain:
```
https://yourdomain.com/auth/google/callback
https://yourdomain.com/api/auth/google/callback
```

And update `FRONTEND_URL` in your environment variables.

## 📝 Notes
- Google OAuth is optional - your app works without it
- Users can still register/login with email/password
- Google users get automatic email verification
- Profile pictures are imported from Google accounts
