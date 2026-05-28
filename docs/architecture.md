# Architecture

AI Business Assistant is organized as a two-app monorepo:

- `frontend`: Next.js App Router client application
- `backend`: Express API server with Prisma/PostgreSQL

The backend uses a modular request flow:

`routes -> controllers -> services -> prisma/database`

AI integration is intentionally isolated behind service/config boundaries so OpenAI-backed features can be added without leaking vendor-specific logic into routes or UI components.
