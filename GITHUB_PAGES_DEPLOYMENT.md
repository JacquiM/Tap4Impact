# GitHub Pages Deployment Guide

This guide explains how to deploy the Tap4Impact frontend to GitHub Pages.

## 🌐 GitHub Pages Deployment

### Automatic Deployment

The repository is configured with GitHub Actions to automatically deploy to GitHub Pages when you push to the `main` branch.

**Setup Steps:**

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to Main Branch**
   - Any push to the `main` branch will trigger the deployment
   - The workflow will build the frontend and deploy it to GitHub Pages

3. **Access Your Site**
   - Your site will be available at: `https://jacquim.github.io/Tap4Impact/`
   - Wait a few minutes for the first deployment to complete

### Manual Deployment

If you need to deploy manually:

```bash
# Build the frontend for GitHub Pages
npm run build:frontend

# The built files will be in dist/public/
# You can then manually upload these to GitHub Pages
```

## ⚙️ Configuration

### Vite Configuration
The `vite.config.ts` is configured to:
- Set the correct base path for GitHub Pages (`/Tap4Impact/`)
- Build only the frontend assets
- Handle routing for single-page applications

### Routing Support
- Uses `404.html` to handle client-side routing
- All routes redirect to `index.html` for proper SPA behavior
- Compatible with React Router and other client-side routers

## 🔧 Backend Considerations

**Important:** GitHub Pages only serves static files and cannot run your Express.js backend.

### Options for Backend:

1. **Separate Backend Deployment**
   - Deploy backend to Railway, Vercel, Heroku, or similar
   - Update frontend API calls to point to your backend URL
   - Handle CORS configuration on the backend

2. **Serverless Functions**
   - Convert backend routes to serverless functions
   - Deploy to Vercel, Netlify, or AWS Lambda
   - Update API endpoints in frontend

3. **Static Build (if possible)**
   - Pre-build data at build time
   - Include as static JSON files
   - Good for content that doesn't change frequently

### Frontend-Only Features

For a GitHub Pages deployment, you can:
- ✅ Display project information
- ✅ Show donation statistics (if pre-built)
- ✅ Contact forms (using services like Formspree)
- ✅ Static content and images
- ❌ Real-time donations processing
- ❌ Database operations
- ❌ User authentication
- ❌ Stripe payments (needs backend)

## 🔄 Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Triggers**: On push to `main` or pull requests
2. **Build Steps**:
   - Checkout code
   - Setup Node.js 18
   - Install dependencies
   - Run type checking
   - Build frontend with GitHub Pages configuration
3. **Deploy**: Only deploys on `main` branch pushes

## 🌍 Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to `client/public/` with your domain:
   ```
   tap4impact.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `jacquim.github.io`
   - Or A records pointing to GitHub Pages IPs

3. Enable HTTPS in repository settings

## 🚨 Limitations

### GitHub Pages Limitations:
- Static hosting only (no server-side code)
- 1GB storage limit
- 100GB bandwidth per month
- No database or backend processing

### For Full Application:
Consider these alternatives for the complete app:
- **Railway**: Full-stack deployment
- **Vercel**: Frontend + serverless functions
- **Netlify**: Frontend + serverless functions
- **Heroku**: Full-stack deployment

## 📝 Development Workflow

```bash
# Local development
npm run dev

# Build for production
npm run build

# Build frontend only (GitHub Pages)
npm run build:frontend

# Type checking
npm run check
```

## 🔍 Troubleshooting

### Common Issues:

1. **404 Errors on Refresh**
   - Ensure `404.html` is in the build output
   - Check that routing script is in `index.html`

2. **Assets Not Loading**
   - Verify `base` path in `vite.config.ts`
   - Ensure all asset paths are relative

3. **API Calls Failing**
   - Update API URLs to point to deployed backend
   - Check CORS configuration

4. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Review build logs in GitHub Actions

### Deployment Status
Check deployment status:
- GitHub repository → **Actions** tab
- Look for the latest workflow run
- Green checkmark = successful deployment
- Red X = failed deployment (check logs)

---

For questions or issues with the deployment, check the GitHub Actions logs or create an issue in the repository.
