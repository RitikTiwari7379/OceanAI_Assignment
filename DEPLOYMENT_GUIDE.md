# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide walks you through deploying ContentCraft Pro on Vercel (frontend) and Render (backend).

---

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com
4. **Google Gemini API Key** - Get from https://ai.google.dev/tutorials/setup
5. **Environment Variables** - Prepare your .env files

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/OceanAI_Assignment.git
git push -u origin main
```

### 1.2 Verify Configuration Files

Ensure these files exist in your repository:
- `backend/render.yaml` ✓
- `backend/.env.example` ✓
- `frontend/vercel.json` ✓

---

## Step 2: Deploy Backend on Render

### 2.1 Connect Render to GitHub

1. Go to https://render.com and log in
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository from GitHub"**
4. Authorize Render with your GitHub account if needed
5. Select your repository: `OceanAI_Assignment`
6. Fill in the deployment details:
   - **Name**: `contentcraft-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Click **"Create Web Service"**

### 2.2 Configure Environment Variables

1. After service creation, go to the **Environment** tab
2. Add these environment variables:

```
SECRET_KEY = your-super-secret-key (generate a random string)
GEMINI_API_KEY = your-gemini-api-key-here
CORS_ORIGINS = http://localhost:3000,https://your-vercel-url.vercel.app
PYTHON_VERSION = 3.11.0
```

(You'll update `CORS_ORIGINS` with your Vercel URL after Step 3)

**To generate a SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.3 Get Your Backend URL

1. In Render dashboard, go to your web service
2. Copy the **URL** from the top of the page
3. It will look like: `https://contentcraft-backend-xyz.onrender.com`
4. Save this for Step 3

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Connect Vercel to GitHub

1. Go to https://vercel.com and log in
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Configure project settings:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.2 Configure Environment Variables

1. Click **"Environment Variables"**
2. Add this variable:

```
REACT_APP_BACKEND_URL = https://contentcraft-backend-xyz.onrender.com
```
(Replace with your actual Render backend URL from Step 2.3)

3. Click **"Deploy"**

### 3.3 Get Your Frontend URL

After deployment completes:
- Your frontend URL will be something like: `https://yourproject.vercel.app`

---

## Step 4: Update Backend CORS

Now update your Render backend with the Vercel frontend URL:

1. Go back to Render dashboard
2. Go to your web service and click **Environment**
3. Update the **CORS_ORIGINS** environment variable:
```
CORS_ORIGINS = http://localhost:3000,https://yourproject.vercel.app
```

4. Render will automatically redeploy with the new variable

---

## Step 5: Verify Deployment

### 5.1 Test Backend API

Visit this URL in your browser:
```
https://your-railway-url/docs
```

You should see the FastAPI Swagger documentation.

### 5.2 Test Frontend

Visit this URL in your browser:
```
https://yourproject.vercel.app
```

The application should load without errors.

### 5.3 Test Authentication

1. Try signing up with a test email
2. Verify the backend receives and stores the user
3. Try logging in
4. Try creating a document

### 5.4 Check Logs

**Backend Logs (Render):**
- Go to Render dashboard → Web Service → Logs

**Frontend Logs (Vercel):**
- Go to Vercel dashboard → Deployments → Logs

---

## Troubleshooting

### 401/403 CORS Errors

**Issue:** Frontend can't communicate with backend

**Solution:** 
1. Verify `CORS_ORIGINS` is set correctly in Render
2. Check that it includes your Vercel domain
3. Restart Render deployment by going to Settings → Deploy

### 503 Service Unavailable

**Issue:** Render app crashed or timed out

**Solution:**
1. Check Render logs for error messages
2. Verify all required environment variables are set
3. Ensure `GEMINI_API_KEY` is valid
4. Check if service is within free tier resource limits

### Build Failures on Vercel

**Issue:** Frontend build fails

**Solution:**
1. Check Vercel build logs
2. Ensure `REACT_APP_BACKEND_URL` is set
3. Run `npm install` locally to verify dependencies

### Database Errors on Render

**Issue:** SQLite database not found

**Solution:**
- Render creates `app.db` automatically on first run
- Check that the backend has write permissions
- Note: Free tier instances are ephemeral; data persists in the deployed environment

---

## Update & Redeploy

### Frontend Updates
```bash
git commit -am "Frontend changes"
git push origin main
# Vercel automatically redeploys
```

### Backend Updates
```bash
git commit -am "Backend changes"
git push origin main
# Railway automatically redeploys
```

---

## Production Checklist

- [ ] `SECRET_KEY` changed to a strong random string
- [ ] `GEMINI_API_KEY` is valid and has sufficient quota
- [ ] `FRONTEND_URL` points to Vercel deployment
- [ ] `REACT_APP_BACKEND_URL` points to Railway deployment
- [ ] CORS is properly configured
- [ ] Both services are running without errors
- [ ] Authentication works end-to-end
- [ ] Document generation works with Gemini API

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/deployment/vercel/)

