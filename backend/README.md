# Backend

Express + TypeScript API for AI Business Assistant.

## Commands

```bash
npm run dev --workspace backend
npm run build --workspace backend
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
```

## API

- `GET /health`: service health
- `GET /api/v1`: API metadata
- `POST /api/v1/auth/signup`: create account
- `POST /api/v1/auth/login`: sign in
- `POST /api/v1/auth/logout`: clear auth cookie
- `GET /api/v1/auth/me`: protected user profile
- `GET /api/v1/protected`: protected route example
- `POST /api/v1/clients`: create a user-owned client
- `GET /api/v1/clients`: list user-owned clients with pagination/search
- `GET /api/v1/clients/:id`: get a user-owned client
- `PUT /api/v1/clients/:id`: update a user-owned client
- `DELETE /api/v1/clients/:id`: delete a user-owned client
- `POST /api/v1/invoices`: create a user-owned invoice
- `GET /api/v1/invoices`: list user-owned invoices with pagination/status filtering
- `GET /api/v1/invoices/:id`: get a user-owned invoice
- `PUT /api/v1/invoices/:id`: update a user-owned invoice
- `DELETE /api/v1/invoices/:id`: delete a user-owned invoice

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_COOKIE_NAME`
- `COOKIE_SECURE`

## Auth Notes

Passwords are hashed with bcrypt before being stored. JWTs are returned in the response for frontend token storage and also set as HTTP-only cookies so the API is ready for cookie-first auth flows.

## Deployment

Prepared for Railway/Render with `npm run build` and `npm run start`.
