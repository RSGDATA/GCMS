# Symphony Portal

A comprehensive web application for a symphony orchestra featuring musician registration, student outreach programs, concert listings, and secure ticket purchasing with Stripe integration.

## Features

### 🎼 Core Functionality
- **Homepage**: Beautiful landing page showcasing the symphony's mission and programs
- **Concert Listings**: Display upcoming concerts with ticket purchasing
- **Musician Portal**: Registration and login system for orchestra musicians
- **Student Outreach**: Free music education program registration for underserved youth
- **About Page**: Detailed information about the organization's history and mission

### 🔒 Security & Payments
- **Stripe Integration**: Secure payment processing for concert tickets
- **Input Sanitization**: All user inputs are sanitized and validated
- **Database Security**: Supabase integration with row-level security
- **Webhook Handling**: Automated payment confirmation and seat management

### 🎨 Design & UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Elegant dark theme with amber accents
- **Smooth Animations**: Hover effects and transitions throughout
- **Accessibility**: Semantic HTML and proper ARIA labels

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- A Stripe account (for payment processing)
- Git installed

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd symphony-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Application Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

## Database Setup

### Supabase Schema

Create the following tables in your Supabase database:

```sql
-- Musicians table
CREATE TABLE musicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  instrument VARCHAR NOT NULL,
  experience_level VARCHAR NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_email VARCHAR UNIQUE NOT NULL,
  parent_name VARCHAR NOT NULL,
  parent_phone VARCHAR NOT NULL,
  student_name VARCHAR NOT NULL,
  student_age INTEGER NOT NULL CHECK (student_age >= 5 AND student_age <= 18),
  student_grade VARCHAR NOT NULL,
  emergency_contact VARCHAR NOT NULL,
  emergency_phone VARCHAR NOT NULL,
  medical_conditions TEXT,
  program_interest VARCHAR NOT NULL CHECK (program_interest IN ('orchestra', 'choir', 'band', 'music_theory', 'individual_lessons')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Concerts table
CREATE TABLE concerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER NOT NULL,
  image_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket purchases table
CREATE TABLE ticket_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concert_id UUID REFERENCES concerts(id) NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_name VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR UNIQUE NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to reduce available seats
CREATE OR REPLACE FUNCTION reduce_available_seats(concert_id UUID, seats_to_reduce INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE concerts 
  SET available_seats = available_seats - seats_to_reduce
  WHERE id = concert_id;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Public read access for concerts
CREATE POLICY "Concerts are viewable by everyone" ON concerts
  FOR SELECT USING (true);

-- Allow inserts for all tables (you may want to restrict this in production)
CREATE POLICY "Allow inserts for musicians" ON musicians
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow inserts for students" ON students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow inserts for ticket_purchases" ON ticket_purchases
  FOR INSERT WITH CHECK (true);
```

## Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Get your API keys** from the Stripe Dashboard:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)

3. **Set up webhooks**:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret (starts with `whsec_`)

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
symphony-portal/
├── src/
│   ├── app/
│   │   ├── about/page.tsx              # About page
│   │   ├── api/
│   │   │   ├── create-payment-intent/  # Stripe payment API
│   │   │   └── webhooks/stripe/        # Stripe webhook handler
│   │   ├── concerts/page.tsx           # Concert listings
│   │   ├── musicians/login/page.tsx    # Musician registration/login
│   │   ├── students/signup/page.tsx    # Student program registration
│   │   ├── globals.css                 # Global styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Homepage
│   └── lib/
│       ├── stripe.ts                   # Stripe configuration
│       ├── supabase.ts                 # Supabase client and types
│       └── utils.ts                    # Utility functions
├── .env.example                        # Environment variables template
├── .env.local                          # Your environment variables (create this)
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## Key Features Explained

### Musician Registration
- Musicians can register with their instrument and experience level
- Simple email-based login system
- Secure data storage with input validation

### Student Outreach Program
- Comprehensive registration form for parents/guardians
- Collects student information, emergency contacts, and medical conditions
- Supports multiple program types (orchestra, choir, band, etc.)

### Concert Ticket Sales
- Displays upcoming concerts with details
- Secure Stripe payment integration
- Automatic seat inventory management
- Email receipts and confirmation

### Security Features
- Input sanitization for all user data
- Email and phone validation
- Stripe webhook verification
- Database constraints and validation

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Stripe webhook URL**
   - Update your Stripe webhook endpoint to your production URL
   - Test the webhook functionality

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@symphonyportal.com or create an issue in this repository.

---

Built with ❤️ for the classical music community
