# AI Business Assistant

A production-grade AI Business Automation SaaS starter for small businesses, freelancers, agencies, and online sellers.

## Stack

- Frontend: Next.js App Router, TypeScript, TailwindCSS, shadcn-ready UI structure
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT architecture with bcrypt password hashing
- AI: Post assistant endpoint with OpenAI (fallback template mode)

## Setup Commands

```bash
cd ai-business-assistant
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run prisma:generate --workspace backend
```

## Run Frontend

```bash
npm run dev --workspace frontend
```

Frontend runs at `http://localhost:3000`.

## Run Backend

```bash
npm run dev --workspace backend
```

Backend runs at `http://localhost:4000`.

## Database Setup

1. Create a PostgreSQL database.
2. Put the connection string in `backend/.env`.
3. Run migrations:

```bash
npm run prisma:migrate --workspace backend
```

## Environment

Never commit real secrets. Use the provided `.env.example` files as templates.

- `frontend/.env.local`: public frontend API URL
- `backend/.env`: database, JWT, CORS, and future OpenAI configuration

## Auth Routes

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/protected`
- `POST /api/v1/clients`
- `GET /api/v1/clients?page=1&limit=10&search=acme`
- `GET /api/v1/clients/:id`
- `PUT /api/v1/clients/:id`
- `DELETE /api/v1/clients/:id`
- `POST /api/v1/invoices`
- `GET /api/v1/invoices?page=1&limit=10&status=DRAFT`
- `GET /api/v1/invoices/:id`
- `PUT /api/v1/invoices/:id`
- `DELETE /api/v1/invoices/:id`
- `GET /api/v1/analytics/summary`
- `POST /api/v1/assistant/generate-post`

## Testing

```bash
npm run lint
npm run build
npm run prisma:migrate --workspace backend
```
