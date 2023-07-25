/*
  Warnings:

  - A unique constraint covering the columns `[reviewCommentId,authorId,id]` on the table `Replys` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Replys_reviewCommentId_authorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Replys_reviewCommentId_authorId_id_key" ON "Replys"("reviewCommentId", "authorId", "id");
