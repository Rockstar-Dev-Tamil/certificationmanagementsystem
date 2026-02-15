# CertiSafe V2 - Secure Digital Certification Management

**CertiSafe** is a premium, secure digital certification management platform built with Next.js 15. It empowers organizations to issue, manage, and verify professional certificates with ease.

## 🚀 Cloud-Native Architecture
CertiSafe is now powered by **Supabase (PostgreSQL)**, ensuring 99.9% uptime and seamless integration with Vercel.

## Key Features
- 🛡️ **Fraud Proof**: QR-based instant verification with cryptographic tamper protection.
- 🕒 **Expiry Tracking**: Automated credential lifecycle management.
- 📊 **Centralized Hub**: Institutional-grade analytics and certificate ledger.
- 🔐 **Secure Auth**: Role-based access control with JWT encryption.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (Premium SaaS Aesthetic)
- **Security**: JWT, Bcryptjs, SHA-256 Hashing

## Getting Started

### 1. Database Setup
1. Create a project at [Supabase](https://supabase.com/).
2. Run the provided `supabase_schema.sql` in the Supabase SQL Editor.
3. Add the following environment variables to your `.env.local` or Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `JWT_SECRET`: A secure random string for tokens
   - `NEXT_PUBLIC_BASE_URL`: `https://certificationmanagementsystem-nine.vercel.app`

### 2. Run Locally
```bash
npm install
npm run dev
```

## Production Deployment
The project is optimized for **Vercel**. Every push to the `main` branch trigger an automated build and deployment with the latest UI and security protocols.
