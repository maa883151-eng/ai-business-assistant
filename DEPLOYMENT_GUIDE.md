# AI Business Assistant - Deployment Guide

This guide explains how to deploy the **AI Business Assistant** full-stack SaaS project to production for free using **Vercel** (for the frontend), **Render** (for the backend), and **Supabase** (for the PostgreSQL database).

---

## Deployment Architecture

```
┌─────────────────────────────────┐
│        Vercel (Frontend)        │
│      https://your-app.vercel.app │
└────────────────┬────────────────┘
                 │ (REST API / JSON)
                 ▼
┌─────────────────────────────────┐
│        Render (Backend)         │
│     https://your-api.onrender.com│
└────────────────┬────────────────┘
                 │ (Prisma ORM)
                 ▼
┌─────────────────────────────────┐
│       Supabase (Database)       │
│      PostgreSQL Database Instance│
└─────────────────────────────────┘
```

---

## Step 1: Set Up the Database (Supabase)
We will use **Supabase** for a 100% free and permanent PostgreSQL database.

1. Go to [supabase.com](https://supabase.com) and click **Sign Up** (choose **Continue with GitHub**).
2. Click **New Project** and select your organization.
3. Fill in the project details:
   - **Name:** `ai-business-assistant-db`
   - **Database Password:** (Create a strong password and save it somewhere secure!)
   - **Region:** Choose the region closest to your target audience.
4. Click **Create new project** and wait a few minutes for the database to provision.
5. Once ready, go to **Project Settings** (gear icon on the left) -> **Database**.
6. Under **Connection string**, select **URI** and copy the string. It looks like this:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
7. **Important:** Replace `[YOUR-PASSWORD]` with the password you created in step 3. Keep this URI ready; this is your `DATABASE_URL`.

---

## Step 2: Deploy the Backend (Render)
We will deploy the Node.js/Express API to **Render** for free.

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign up using your **GitHub** account.
2. Click **New** (top right) -> **Web Service**.
3. Choose **Build and deploy from a Git repository** and click **Next**.
4. Select your `ai-business-assistant` repository from the list.
5. Configure the Web Service settings:
   - **Name:** `ai-business-api`
   - **Region:** Same region as your Supabase database.
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build && npm run prisma:generate`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free`
6. Click **Advanced** and add the following **Environment Variables**:

| Key | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Set environment to production |
| `DATABASE_URL` | *(The Supabase Connection URI from Step 1)* | **Crucial:** Paste the exact connection string |
| `JWT_SECRET` | `replace-with-a-long-random-secret-at-least-32-chars` | Create a long random string of letters and numbers |
| `JWT_EXPIRES_IN` | `7d` | Token expiry time |
| `JWT_COOKIE_NAME` | `aba_access_token` | Cookie name |
| `COOKIE_SECURE` | `true` | Must be `true` for production HTTPS |
| `FRONTEND_URL` | `https://your-app-name.vercel.app` | **Note:** We will update this with the real Vercel URL in Step 3! |

7. Click **Create Web Service** at the bottom. Render will now build and deploy your backend.
8. Once the build finishes successfully, copy your live backend API URL (e.g., `https://ai-business-api.onrender.com`) displayed at the top of the Render page.

---

## Step 3: Deploy the Frontend (Vercel)
We will deploy the Next.js app to **Vercel** for free.

1. Go to [vercel.com](https://vercel.com) and click **Sign Up** (choose **Continue with GitHub**).
2. Click **Add New** -> **Project**.
3. Import your `ai-business-assistant` repository.
4. Configure the Project settings:
   - **Project Name:** `ai-business-assistant` (or any name you prefer)
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select **`frontend`**. Click **Continue**.
5. Expand the **Environment Variables** section and add:

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | *(Your Render API URL from Step 2)* | **Crucial:** Enter your live Render URL, e.g., `https://ai-business-api.onrender.com` |

6. Click **Deploy**. Vercel will build and deploy your frontend in less than 2 minutes.
7. Once completed, you will get your live website URL (e.g., `https://ai-business-assistant.vercel.app`).

---

## Step 4: Link Frontend and Backend (Final Step!)
To allow the frontend and backend to communicate securely (CORS and Cookie handling), we need to update the `FRONTEND_URL` on Render.

1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Click on your `ai-business-api` web service.
3. Go to **Environment** on the left menu.
4. Locate the `FRONTEND_URL` variable.
5. Update its value to your live Vercel frontend URL (e.g., `https://ai-business-assistant.vercel.app`).
6. Click **Save Changes**. Render will automatically redeploy the backend with the updated configuration.

---

## 🎉 Done!
Your production-grade **AI Business Assistant** is now completely live!
- Your website is accessible via your Vercel URL.
- Authentication, Clients, Invoices, and Analytics are fully functional and connected to your production database on Supabase.
