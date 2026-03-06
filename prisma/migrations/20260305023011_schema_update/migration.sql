-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goal" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "type" TEXT NOT NULL DEFAULT 'petition',
    "creatorName" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,
    "imageUrl" TEXT,
    "emailTarget" TEXT,
    "editToken" TEXT NOT NULL,
    "createdById" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Campaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("createdAt", "createdById", "creatorEmail", "creatorName", "description", "editToken", "emailTarget", "goal", "id", "imageUrl", "status", "title", "type") SELECT "createdAt", "createdById", "creatorEmail", "creatorName", "description", "editToken", "emailTarget", "goal", "id", "imageUrl", "status", "title", "type" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE UNIQUE INDEX "Campaign_editToken_key" ON "Campaign"("editToken");
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "EmailLog_campaignId_idx" ON "EmailLog"("campaignId");

-- CreateIndex
CREATE INDEX "EmailTarget_campaignId_idx" ON "EmailTarget"("campaignId");

-- CreateIndex
CREATE INDEX "Participant_campaignId_idx" ON "Participant"("campaignId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
