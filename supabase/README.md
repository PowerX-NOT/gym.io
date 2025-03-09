## Setting Up Supabase

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign Up" and create an account
3. Verify your email address

### 2. Create a New Project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: FlexTrack (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Click "Create New Project"
5. Wait for the project to be created (usually takes 1-2 minutes)

### 3. Get API Credentials

1. In your project dashboard, go to Project Settings (gear icon)
2. Click on "API" in the sidebar
3. You'll find two important values:
   - Project URL (`VITE_SUPABASE_URL`)
   - Project API Key (`VITE_SUPABASE_ANON_KEY`)
4. Copy these values to your `.env` file

# Supabase Database Migrations Guide

This guide explains how to manage and apply database migrations with Supabase.

## Prerequisites

### 1. Install Supabase CLI
Install the Supabase CLI globally using the following command:

```bash
npm install -g supabase
```

### 2. Log in to Supabase
Run the following command to authenticate:

```bash
npx supabase login
```

This will open a browser where you can log in to your Supabase account. After logging in, your token will be stored locally.

### 3. Ensure Access to Your Supabase Project
Make sure you have access to your Supabase project before proceeding.

## Migration Files Location

All migration files are stored in the `/supabase/migrations` directory. Each migration file should:
- Have a descriptive name (e.g., `create_users_table.sql`).
- Include a clear comment block explaining the changes.
- Contain valid PostgreSQL statements.

## Applying Migrations

### 1. Link Your Project
First, link your local project to your Supabase project using the following command:

```bash
npx supabase link --project-ref <your-project-ref>
```

Replace `<your-project-ref>` with your Supabase project reference ID, which can be found in your project's dashboard URL.

### 2. Push Migrations
To apply your migrations to the database, use the following command:

```bash
npx supabase db push
```

This command will:
- Read all migration files.
- Apply them in order.
- Update your database schema.

### 3. Verify Changes
After pushing migrations:
1. Open your Supabase dashboard.
2. Navigate to the **Table Editor**.
3. Verify that all changes have been applied correctly.

By following these steps, you can efficiently manage and apply database migrations in Supabase.

## Best Practices

1. **Always Test Locally First**
   - Use `npx supabase start` to test migrations locally
   - Verify changes work as expected before pushing to production

2. **One Change Per Migration**
   - Keep migrations focused and atomic
   - Makes it easier to track and rollback changes

3. **Clear Documentation**
   - Include detailed comments in migration files
   - Document what changes are being made and why

4. **Backup Your Database**
   - Always backup your database before applying migrations
   - Use `npx supabase db dump` to create backups

## Common Issues

1. **Migration Failed**
   - Check the error message in the CLI output
   - Verify SQL syntax
   - Ensure dependencies (tables, columns) exist

2. **Version Conflicts**
   - Make sure your local migrations are in sync
   - Pull latest changes before pushing new migrations

## Need Help?

- Check [Supabase Documentation](https://supabase.com/docs)
- Visit [Supabase GitHub](https://github.com/supabase/supabase)
- Join [Supabase Discord](https://discord.supabase.com)
