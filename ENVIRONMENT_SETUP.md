# Environment Setup Guide

## Frontend Environment Variables

### 1. Create `.env.local` file in the root directory:

```bash
# Copy from env.template
cp env.template .env.local
```

### 2. Update `.env.local` with your settings:

```env
# For local development (default)
REACT_APP_API_URL=http://localhost:5000

# For mobile testing (use your computer's IP)
REACT_APP_API_URL=http://192.168.1.45:5000

# For production deployment
REACT_APP_API_URL=https://your-api-domain.com
```

## Backend Environment Variables

The backend uses `backend/config.env` for configuration. Key variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:3000

# API URL (for OAuth callbacks)
REACT_APP_API_URL=http://localhost:5000

# Database
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development Setup

### For Local Development:
1. Frontend: `REACT_APP_API_URL=http://localhost:5000`
2. Backend: `FRONTEND_URL=http://localhost:3000`

### For Mobile Testing:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Frontend: `REACT_APP_API_URL=http://YOUR_IP:5000`
3. Backend: `FRONTEND_URL=http://YOUR_IP:3000`
4. Update Google OAuth settings with your IP

### For Production:
1. Deploy your backend to a hosting service
2. Update all URLs to use your production domain
3. Update Google OAuth settings with production URLs

## Important Notes

- ✅ All hardcoded IP addresses have been replaced with environment variables
- ✅ Default fallback is `localhost` for development
- ✅ Frontend automatically uses `REACT_APP_API_URL` from environment
- ✅ Backend uses environment variables for all external URLs
- ✅ Google OAuth callbacks use environment variables

## Troubleshooting

If you're getting connection errors:
1. Check that your `.env.local` file exists and has the correct API URL
2. Ensure the backend server is running on the specified port
3. For mobile testing, make sure both devices are on the same network
4. Check firewall settings if using IP addresses

