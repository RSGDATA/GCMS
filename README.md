# GCMS - Symphony Portal

This repository contains the Symphony Portal, a Next.js application for managing symphony concerts, musicians, and student interactions.

## Project Structure

The main application is located in the `symphony-portal` directory, which is a Next.js project.

## Local Development

To run the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/RSGDATA/GCMS.git
   cd GCMS/symphony-portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the necessary environment variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # Application Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages using GitHub Actions. The deployment workflow is defined in `.github/workflows/deploy.yml`.

### Setting up GitHub Pages

1. Go to your GitHub repository settings.
2. Navigate to the "Pages" section.
3. Under "Source", select "GitHub Actions".
4. The site will be deployed automatically when changes are pushed to the main branch.

### Setting up GitHub Secrets

For the deployment to work correctly, you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository settings.
2. Navigate to the "Secrets and variables" > "Actions" section.
3. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your GitHub Pages URL, e.g., https://rsgdata.github.io/GCMS)

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Stripe
- NextAuth.js
