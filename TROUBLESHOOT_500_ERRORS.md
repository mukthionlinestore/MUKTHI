# Troubleshooting 500 Errors on Render

## Step 1: Check Backend Logs

1. Go to **Render Dashboard** → **mukthi-backend** → **Logs** tab
2. Look for error messages related to:
   - MongoDB connection errors
   - Missing environment variables
   - Route/model errors
   - Authentication errors

## Common Issues & Solutions:

### Issue 1: MongoDB Connection Error

**Error looks like:**
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
MongoNetworkError: failed to connect to server
```

**Solutions:**
- Verify `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify database user credentials are correct
- Make sure password doesn't have special characters that need encoding

**Fix:**
1. Go to MongoDB Atlas → Security → Network Access
2. Click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
3. Go to Database Access → Verify user exists and password is correct
4. Update `MONGODB_URI` in Render if needed

---

### Issue 2: FRONTEND_URL Not Set

**Error looks like:**
```
CORS error
Access-Control-Allow-Origin
```

**Fix:**
1. Go to Render Dashboard → mukthi-backend → Environment
2. Find `FRONTEND_URL` variable
3. Update it to your actual frontend URL (e.g., `https://mukthi-frontend.onrender.com`)
4. Save changes (will redeploy)

---

### Issue 3: Missing Environment Variables

**Error looks like:**
```
Cannot read property 'CLOUDINARY_CLOUD_NAME' of undefined
JWT_SECRET is not defined
```

**Fix:**
Check all environment variables are set in Render:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-random-string
SESSION_SECRET=your-session-secret
FRONTEND_URL=https://your-frontend.onrender.com
CLOUDINARY_CLOUD_NAME=drimd7wtx
CLOUDINARY_API_KEY=385318261547754
CLOUDINARY_API_SECRET=jtyLl-lTgwbYXGPeK7E5ykwox3E
```

---

### Issue 4: Models Trying to Access Non-Existent Collections

**Error looks like:**
```
Cannot read property of null
TypeError: Cannot read property 'findOne' of undefined
```

**This is where seeding helps** - But if collections don't exist, MongoDB will create them automatically when first document is inserted.

**Temporary Fix:**
Some routes might fail if they expect data. You can:
1. Make routes return empty arrays instead of 500 errors
2. Or add default fallback data in the models
3. Or create initial data through admin panel after login

---

## Step 2: Test Backend Directly

Test if backend is running and can connect to database:

1. Visit in browser:
   ```
   https://mukthi-backend.onrender.com/
   ```
   Should return: "Server is running" or similar

2. Test a simple endpoint:
   ```
   https://mukthi-backend.onrender.com/api/products
   ```
   Should return: `[]` (empty array) or products list

---

## Step 3: Check Specific Endpoints

Visit these URLs directly in browser to see actual error messages:

```
https://mukthi-backend.onrender.com/api/settings
https://mukthi-backend.onrender.com/api/footer
https://mukthi-backend.onrender.com/api/superadmin/public-config
https://mukthi-backend.onrender.com/api/products
```

If they return 500, check backend logs for the error message.

---

## Step 4: Verify MongoDB Atlas Setup

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com
2. **Check Cluster is Running** (green status)
3. **Network Access**:
   - Should have `0.0.0.0/0` (Allow from anywhere)
4. **Database Access**:
   - User should exist
   - User should have "Read and write to any database" permission
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with actual password
   - Make sure it matches what's in Render environment variables

---

## Step 5: Common MongoDB URI Issues

**Wrong Format:**
```
❌ mongodb://localhost:27017/ecommerce
```

**Correct Format for Atlas:**
```
✅ mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Special Characters in Password:**
If password has special characters like `@`, `#`, `$`, etc., they must be URL encoded:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- etc.

Example:
```
Password: MyP@ss#123
Encoded: MyP%40ss%23123
```

---

## Step 6: Enable Better Error Logging

If you can't find the issue, temporarily add this to your backend routes to get better errors:

In `backend/server.js`, check if there's error handling middleware. It should look like:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

---

## Quick Diagnosis Checklist:

- [ ] Backend is deployed successfully on Render
- [ ] MongoDB Atlas cluster is running
- [ ] Network Access allows 0.0.0.0/0
- [ ] Database user credentials are correct
- [ ] MONGODB_URI in Render matches Atlas connection string
- [ ] All required environment variables are set
- [ ] FRONTEND_URL is set to your frontend URL
- [ ] Backend logs show "Connected to MongoDB" message
- [ ] No CORS errors in browser console

---

## What to Share for Help:

If still having issues, share:
1. **Backend logs** from Render (last 50 lines)
2. **Exact error message** from browser console
3. **Response** when visiting backend URL directly
4. **MongoDB Atlas** network access screenshot

---

## Next Steps:

1. **Check backend logs** in Render now
2. **Find the actual error message**
3. **Share the error** and I'll help you fix it specifically

The logs will tell us exactly what's wrong! 🔍

