-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BugReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BugReport" ("createdAt", "id", "report", "resolved", "updatedAt", "userId") SELECT "createdAt", "id", "report", "resolved", "updatedAt", "userId" FROM "BugReport";
DROP TABLE "BugReport";
ALTER TABLE "new_BugReport" RENAME TO "BugReport";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
