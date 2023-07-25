/*
  Warnings:

  - You are about to drop the `CommentLikes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reviewId,authorId]` on the table `ReviewComment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `ReviewComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_reviewCommentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_userId_fkey";

-- AlterTable
ALTER TABLE "ReviewComment" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "totalDislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalLikes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "CommentLikes";

-- CreateTable
CREATE TABLE "Replys" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "reviewCommentId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalDislikes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Replys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyOpinion" (
    "userId" TEXT NOT NULL,
    "replyId" INTEGER NOT NULL,
    "opinion" "Opinion" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "ReplyOpinion_pkey" PRIMARY KEY ("userId","replyId")
);

-- CreateTable
CREATE TABLE "CommentOpinion" (
    "userId" TEXT NOT NULL,
    "reviewCommentId" INTEGER NOT NULL,
    "opinion" "Opinion" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "CommentOpinion_pkey" PRIMARY KEY ("userId","reviewCommentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Replys_reviewCommentId_authorId_key" ON "Replys"("reviewCommentId", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewComment_reviewId_authorId_key" ON "ReviewComment"("reviewId", "authorId");

-- AddForeignKey
ALTER TABLE "Replys" ADD CONSTRAINT "Replys_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replys" ADD CONSTRAINT "Replys_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyOpinion" ADD CONSTRAINT "ReplyOpinion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyOpinion" ADD CONSTRAINT "ReplyOpinion_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOpinion" ADD CONSTRAINT "CommentOpinion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOpinion" ADD CONSTRAINT "CommentOpinion_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
