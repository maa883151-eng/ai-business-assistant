CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'CANCELLED');

ALTER TABLE "Invoice" DROP CONSTRAINT IF EXISTS "Invoice_number_key";

ALTER TABLE "Invoice"
RENAME COLUMN "number" TO "invoiceNumber";

ALTER TABLE "Invoice"
ADD COLUMN "userId" TEXT,
ADD COLUMN "clientId" TEXT,
ADD COLUMN "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "status_new" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT';

UPDATE "Invoice"
SET
  "userId" = (
    SELECT "id"
    FROM "User"
    ORDER BY "createdAt" ASC
    LIMIT 1
  ),
  "clientId" = (
    SELECT "id"
    FROM "Client"
    ORDER BY "createdAt" ASC
    LIMIT 1
  ),
  "subtotal" = "total";

ALTER TABLE "Invoice"
DROP COLUMN "status",
DROP COLUMN "currency",
DROP COLUMN "dueDate";

ALTER TABLE "Invoice"
RENAME COLUMN "status_new" TO "status";

ALTER TABLE "Invoice"
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "clientId" SET NOT NULL;

ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Invoice_userId_invoiceNumber_key" ON "Invoice"("userId", "invoiceNumber");
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");
CREATE INDEX "Invoice_userId_status_idx" ON "Invoice"("userId", "status");

CREATE TABLE "InvoiceItem" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(65,30) NOT NULL,
  "price" DECIMAL(65,30) NOT NULL,
  "total" DECIMAL(65,30) NOT NULL,
  CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "InvoiceItem"
ADD CONSTRAINT "InvoiceItem_invoiceId_fkey"
FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");
