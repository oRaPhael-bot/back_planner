-- CreateTable
CREATE TABLE "Partcipants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
