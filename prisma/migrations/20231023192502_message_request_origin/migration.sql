-- CreateTable
CREATE TABLE "HoneyPot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL DEFAULT 'default',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL DEFAULT 'default',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactRequest" ("createdAt", "id", "message", "name", "phone", "updatedAt") SELECT "createdAt", "id", "message", "name", "phone", "updatedAt" FROM "ContactRequest";
DROP TABLE "ContactRequest";
ALTER TABLE "new_ContactRequest" RENAME TO "ContactRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
