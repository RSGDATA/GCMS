# GitHub Pages Deployment Guide for Symphony Portal

## Overview

This document provides a comprehensive explanation of the configuration changes made to deploy the Symphony Portal application to GitHub Pages. It covers the technical components, their relationships, and the deployment workflow.

## Table of Contents

1. [Components Overview](#components-overview)
2. [Next.js Configuration](#nextjs-configuration)
3. [GitHub Actions Workflow](#github-actions-workflow)
4. [Environment Variables](#environment-variables)
5. [Deployment Process](#deployment-process)
6. [Troubleshooting](#troubleshooting)

## Components Overview

The GitHub Pages deployment setup consists of the following key components:

1. **Next.js Configuration** (`next.config.ts`): Configures the Next.js application for static export and GitHub Pages hosting.
2. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`): Automates the build and deployment process.
3. **Environment Variables**: Managed through GitHub Secrets for secure deployment.
4. **GitHub Pages Settings**: Configuration in the GitHub repository settings.

## Next.js Configuration

The `next.config.ts` file has been modified to support static export and GitHub Pages hosting:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/GCMS' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

### Configuration Explanation

1. **`output: 'export'`**: 
   - Tells Next.js to generate static HTML files instead of requiring a Node.js server
   - Essential for GitHub Pages which only serves static files

2. **`basePath: process.env.NODE_ENV === 'production' ? '/GCMS' : ''`**:
   - Sets the base path for the application in production to `/GCMS` (your repository name)
   - Keeps the base path empty for local development
   - This ensures URLs work correctly both locally and on GitHub Pages

3. **`images: { unoptimized: true }`**:
   - Disables Next.js image optimization which requires server-side processing
   - Required for static export since GitHub Pages can't perform image optimization

4. **`trailingSlash: true`**:
   - Adds a trailing slash to all URLs
   - Helps with routing on GitHub Pages to ensure proper path resolution

## GitHub Actions Workflow

The GitHub Actions workflow file (`.github/workflows/deploy.yml`) automates the build and deployment process:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'
          cache-dependency-path: 'symphony-portal/package-lock.json'
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Install dependencies
        run: cd symphony-portal && npm ci
      
      - name: Build with Next.js
        run: cd symphony-portal && npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL || 'https://rsgdata.github.io/GCMS' }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./symphony-portal/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Workflow Explanation

1. **Triggers**:
   - The workflow runs when changes are pushed to the `main` branch
   - It can also be manually triggered using `workflow_dispatch`

2. **Permissions**:
   - `contents: read`: Allows reading repository contents
   - `pages: write`: Allows deploying to GitHub Pages
   - `id-token: write`: Allows authentication for GitHub Pages deployment

3. **Concurrency**:
   - Ensures only one deployment runs at a time
   - Cancels in-progress deployments if a new one is triggered

4. **Build Job**:
   - Checks out the repository code
   - Sets up Node.js environment
   - Configures GitHub Pages
   - Installs dependencies
   - Builds the Next.js application with environment variables
   - Uploads the build output as an artifact

5. **Deploy Job**:
   - Depends on the build job completing successfully
   - Deploys the artifact to GitHub Pages
   - Outputs the deployment URL

## Environment Variables

The application uses several environment variables that need to be set as GitHub Secrets:

1. **Supabase Configuration**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

2. **Stripe Configuration**:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

3. **NextAuth Configuration**:
   - `NEXTAUTH_URL`: Set to your GitHub Pages URL (https://rsgdata.github.io/GCMS)
   - `NEXTAUTH_SECRET`: A secret for NextAuth.js

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each environment variable as a separate secret

## Deployment Process

The deployment process follows these steps:

1. **Code Changes**:
   - Developer makes changes to the codebase
   - Changes are committed and pushed to the `main` branch

2. **Automated Build**:
   - GitHub Actions workflow is triggered
   - The workflow checks out the code
   - Node.js environment is set up
   - Dependencies are installed
   - Next.js application is built with environment variables

3. **Deployment**:
   - Build output is uploaded as an artifact
   - GitHub Pages deployment action deploys the artifact
   - The site becomes available at https://rsgdata.github.io/GCMS

## Troubleshooting

### Common Issues and Solutions

1. **Blank Page or 404 Errors**:
   - Check that `basePath` is correctly set to your repository name
   - Ensure `trailingSlash` is set to `true`
   - Verify that GitHub Pages is enabled and set to GitHub Actions

2. **Missing Environment Variables**:
   - Confirm all required secrets are set in GitHub repository settings
   - Check the GitHub Actions workflow logs for any missing variables

3. **Build Failures**:
   - Review the GitHub Actions workflow logs for error messages
   - Ensure the project builds successfully locally before pushing

4. **Image Loading Issues**:
   - Verify that `images: { unoptimized: true }` is set in Next.js config
   - Check that image paths use relative URLs that work with the basePath

5. **API Calls Failing**:
   - Ensure API endpoints account for the basePath in production
   - For external APIs, check CORS settings if applicable
