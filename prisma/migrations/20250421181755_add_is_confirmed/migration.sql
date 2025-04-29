/*
  Warnings:

  - You are about to drop the `Partcipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Partcipants";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
