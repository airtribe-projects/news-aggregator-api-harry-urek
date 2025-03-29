/*
  Warnings:

  - You are about to alter the column `categories` on the `Preferences` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categories" JSONB NOT NULL,
    "language" TEXT NOT NULL,
    CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Preferences" ("categories", "language", "userId") SELECT "categories", "language", "userId" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
CREATE UNIQUE INDEX "Preferences_userId_key" ON "Preferences"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
