ALTER TABLE "Client"
ADD COLUMN "userId" TEXT,
ADD COLUMN "notes" TEXT;

UPDATE "Client"
SET "userId" = (
  SELECT "id"
  FROM "User"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "userId" IS NULL;

ALTER TABLE "Client"
ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Client"
ADD CONSTRAINT "Client_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Client_userId_idx" ON "Client"("userId");
CREATE INDEX "Client_userId_name_idx" ON "Client"("userId", "name");
CREATE INDEX "Client_userId_email_idx" ON "Client"("userId", "email");
