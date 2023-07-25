/*
  Warnings:

  - A unique constraint covering the columns `[reviewId,authorId,id]` on the table `ReviewComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ReviewComment_reviewId_authorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ReviewComment_reviewId_authorId_id_key" ON "ReviewComment"("reviewId", "authorId", "id");
