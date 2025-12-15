# Self-Hosting Changes.Page

This guide will help you set up and deploy Changes.Page on your own infrastructure.

## Database Setup

You have two options for setting up the database:

### Option 1: Local Supabase (Recommended for Development)

Follow the official Supabase self-hosting guide using Docker:
https://supabase.com/docs/guides/self-hosting/docker

### Option 2: Supabase Cloud

Create a new project at [supabase.com](https://supabase.com) and use the provided connection details.

## Application Deployment

The repository includes Docker Compose files for easy deployment of the applications.

1. Ensure you have Docker and Docker Compose installed
2. Set up your environment variables in the respective `.env` files (see `.env.example` files in `apps/web` and `apps/page`)
3. Run the applications using Docker Compose:

```sh
docker-compose up -d
```

## Feature Limitations

Please note the following limitations when self-hosting:

- **Billing**: Currently only supported through Stripe integration
- **Custom Domains**: Only supported when deployed on Vercel
- **AI Features**: All AI functionality is channeled through OpenRouter

## Environment Configuration

Make sure to configure the following in your environment files:

- Database connection details (Supabase)
- Authentication keys
- Stripe keys (if using billing features)
- Any other third-party service credentials

For detailed environment variable setup, refer to the `.env.example` files in the respective app directories.
