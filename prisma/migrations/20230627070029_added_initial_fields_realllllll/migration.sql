/*
  Warnings:

  - A unique constraint covering the columns `[gameId,authorId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "Stars" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Review_gameId_authorId_key" ON "Review"("gameId", "authorId");
