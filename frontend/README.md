# Frontend

Next.js App Router frontend for AI Business Assistant.

## Commands

```bash
npm run dev --workspace frontend
npm run build --workspace frontend
npm run lint --workspace frontend
```

## Structure

- `app`: App Router pages and layouts
- `components`: Reusable UI and feature components
- `hooks`: React hooks
- `lib`: Shared frontend utilities
- `types`: TypeScript domain types

## Authentication

- `app/login`: login page
- `app/register`: signup page
- `components/auth`: auth forms and route guard
- `components/clients`: client table, modals, and management UI
- `components/invoices`: invoice table, status badges, delete modal, and invoice builder
- `lib/api`: typed API client
- `lib/auth/token-storage.ts`: access token storage utility

Set `NEXT_PUBLIC_API_URL` in `.env.local`.
