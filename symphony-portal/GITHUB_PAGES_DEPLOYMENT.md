# GitHub Pages Deployment Guide

## Overview
Your Next.js app has been configured for GitHub Pages deployment using GitHub Actions with a custom domain. The configuration includes:

1. **Static export configuration** - Using `output: 'export'` for static site generation
2. **Custom domain setup** - Configured for `https://greenvillechambermusicsociety.org/`
3. **Optimized images** - All images are unoptimized for static hosting
4. **GitHub Actions workflow** - Automated build and deployment

## Deployment Steps

### 1. Push Your Changes
```bash
git add .
git commit -m "Configure for GitHub Pages deployment with custom domain"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your GitHub repository: https://github.com/RSGDATA/GCMS
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 3. Repository Settings
Make sure your repository has the correct permissions:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Save

### 4. Custom Domain Configuration
The CNAME file has been added to configure the custom domain:
- **Domain**: `greenvillechambermusicsociety.org`
- **CNAME file**: Located in `public/CNAME` and automatically included in build

### 5. Monitor Deployment
1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy Next.js to GitHub Pages"
3. Click on it to monitor the build and deployment process
4. Once complete, your site will be available at: `https://greenvillechambermusicsociety.org/`

## What Changed

### Configuration Files
- **next.config.ts**: Removed `basePath` configuration
- **.github/workflows/deploy.yml**: Added GitHub Actions workflow
- **src/app/layout.tsx**: Updated favicon paths
- **All component files**: Updated image paths to use direct references

### Image Paths
All images now use direct paths:
- ✅ `src="/GCMS_Logo.png"`
- ❌ `src={process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/GCMS_Logo.png`

### GitHub Actions Workflow
The workflow will:
1. Checkout your code
2. Setup Node.js
3. Install dependencies with `npm ci`
4. Build the static site with `npm run build`
5. Deploy the `out/` directory to GitHub Pages

## Troubleshooting

### If the build fails:
1. Check the Actions tab for error messages
2. Ensure all image files exist in the `public/` directory
3. Verify that `package.json` has the correct build script

### If images don't load:
1. Verify image files are in the `public/` directory
2. Check that image paths in components use direct paths (starting with `/`)
3. Ensure image file names match exactly (case-sensitive)

### If the site doesn't update:
1. Check that the workflow completed successfully
2. Clear your browser cache
3. Wait a few minutes for GitHub Pages to update

## Required Files in public/ Directory
Make sure these files exist:
- `GCMS_Logo.png`
- `london-symphony-orchestra-589180035-597b9cd003f40200109cd349.jpg`
- `NightAtTheMovies-carousel.png`
- `soloist.jpg`
- `chamber.png`
- `pops.png`
- `gcms-favicon.ico`
- `gcms-favicon-16x16.png`
- `gcms-favicon-32x32.png`

## Next Steps
1. Push your changes to GitHub
2. Enable GitHub Pages with GitHub Actions as the source
3. Configure your custom domain DNS settings to point to GitHub Pages
4. Monitor the deployment in the Actions tab
5. Visit your live site at `https://greenvillechambermusicsociety.org/`

Your site should now deploy automatically whenever you push changes to the main branch!
