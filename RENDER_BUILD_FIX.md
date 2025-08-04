# RENDER BUILD FIX - Vite Not Found Error

## 🚨 Issue
The build is failing because `vite` is not found. This happens because Render installs only production dependencies by default, but `vite` is in devDependencies.

## ✅ SOLUTION - Update Your Render Build Command

### Go to your Render service and change the Build Command to:

```bash
NODE_ENV=development npm install && npm run build && cd backend && npm install
```

## 🔧 Alternative Build Commands (try in order if first fails):

### Option 1 (Recommended):
```bash
NODE_ENV=development npm install && npm run build && cd backend && npm install
```

### Option 2:
```bash
npm install --include=dev && npm run build && cd backend && npm install
```

### Option 3:
```bash
npm ci && npm run build && cd backend && npm install
```

## 📋 Complete Render Configuration

### Build & Deploy Settings:
- **Root Directory**: (LEAVE EMPTY)
- **Build Command**: `NODE_ENV=development npm install && npm run build && cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### Environment Variables:
```bash
NODE_ENV=production
VITE_API_KEY=prod_geniq_api_key_2024
GOOGLE_AI_API_KEY=your_actual_google_ai_api_key_here
```

## 🎯 Why This Works

1. **NODE_ENV=development**: Forces npm to install devDependencies (including vite)
2. **npm install**: Installs all dependencies including vite
3. **npm run build**: Builds the React frontend using vite
4. **cd backend && npm install**: Installs backend dependencies

## 🚀 Deploy Steps

1. **Go to your Render service dashboard**
2. **Click Settings → Build & Deploy**
3. **Update Build Command** with the command above
4. **Click "Manual Deploy" → "Deploy latest commit"**
5. **Wait for build to complete**

## 📊 Expected Success Log

Look for these in your Render build logs:
```
==> Running build command 'NODE_ENV=development npm install && npm run build && cd backend && npm install'...
added 438 packages, and audited 439 packages in 15s
> geniq-interview-prep@0.0.0 build
> vite build
vite v5.4.10 building for production...
✓ 2453 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-[hash].css      [size] kB │ gzip:  [size] kB
dist/assets/index-[hash].js       [size] kB │ gzip:  [size] kB
✓ built in [time]s
```

## 🧪 Test After Deployment

Your website will be available at your Render URL. Test with:
- **Frontend**: https://your-app.onrender.com
- **API**: https://your-app.onrender.com/api/health

**This fix will resolve the "vite: not found" error! 🚀**