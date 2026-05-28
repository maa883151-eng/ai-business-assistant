# API Routes

Base URL: `http://localhost:4000/api/v1`

## Authentication

### `POST /auth/signup`

Creates a user, hashes the password with bcrypt, returns a JWT access token, and sets an HTTP-only auth cookie.

Request:

```json
{
  "fullName": "Nayef Ahmed",
  "email": "nayef@example.com",
  "password": "password123"
}
```

### `POST /auth/login`

Validates credentials, returns a JWT access token, and sets an HTTP-only auth cookie.

Request:

```json
{
  "email": "nayef@example.com",
  "password": "password123"
}
```

### `POST /auth/logout`

Clears the auth cookie. The frontend also clears local token storage.

### `GET /auth/me`

Protected route. Requires `Authorization: Bearer <token>` or the HTTP-only auth cookie.

### `GET /protected`

Protected route example using the shared JWT verification middleware.

## Clients

All client routes require `Authorization: Bearer <token>` or the auth cookie. Client records are scoped to the authenticated user.

### `POST /clients`

Creates a client for the authenticated user.

```json
{
  "name": "Acme Co",
  "email": "billing@acme.test",
  "phone": "+1 555 0100",
  "company": "Acme",
  "notes": "Net 15 payment terms"
}
```

### `GET /clients`

Lists clients for the authenticated user.

Query params:

- `page`: default `1`
- `limit`: default `10`, maximum `100`
- `search`: searches name and email

### `GET /clients/:id`

Returns one user-owned client.

### `PUT /clients/:id`

Updates one user-owned client.

### `DELETE /clients/:id`

Deletes one user-owned client.

## Invoices

All invoice routes require `Authorization: Bearer <token>` or the auth cookie. Invoice records are scoped to the authenticated user and must reference one of that user's clients.

### `POST /invoices`

Creates an invoice and calculates item totals, subtotal, tax, and final total on the server.

```json
{
  "clientId": "client_id",
  "invoiceNumber": "INV-2026-001",
  "status": "DRAFT",
  "tax": 25,
  "items": [
    {
      "description": "Website setup",
      "quantity": 1,
      "price": 500
    }
  ]
}
```

### `GET /invoices`

Lists invoices for the authenticated user.

Query params:

- `page`: default `1`
- `limit`: default `10`, maximum `100`
- `status`: optional `DRAFT`, `SENT`, `PAID`, or `CANCELLED`

### `GET /invoices/:id`

Returns one user-owned invoice with client and item details.

### `PUT /invoices/:id`

Updates one user-owned invoice. If items are provided, invoice totals are recalculated.

### `DELETE /invoices/:id`

Deletes one user-owned invoice and its invoice items.

## Analytics

All analytics routes require `Authorization: Bearer <token>` or the auth cookie.

### `GET /analytics/summary`

Returns dashboard summary metrics for the authenticated user.

Response:

```json
{
  "summary": {
    "revenue": 2450,
    "clients": 12,
    "invoices": 21,
    "invoiceStatus": {
      "draft": 4,
      "sent": 7,
      "paid": 9,
      "cancelled": 1
    }
  }
}
```

## Assistant

All assistant routes require `Authorization: Bearer <token>` or the auth cookie.

### `POST /assistant/generate-post`

Generates a short social media post draft. Uses OpenAI when `OPENAI_API_KEY` is present, otherwise falls back to a deterministic template.

Request:

```json
{
  "businessType": "Digital marketing agency",
  "goal": "Announce our new monthly SEO package",
  "tone": "Confident and friendly"
}
```

Response:

```json
{
  "content": "Generated draft text...",
  "provider": "openai"
}
```
