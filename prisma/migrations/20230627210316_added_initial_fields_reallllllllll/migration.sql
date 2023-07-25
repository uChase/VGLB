/*
  Warnings:

  - You are about to drop the `UserReviewDisLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserReviewLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Opinion" AS ENUM ('LIKE', 'DISLIKE', 'NONE');

-- DropForeignKey
ALTER TABLE "UserReviewDisLike" DROP CONSTRAINT "UserReviewDisLike_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "UserReviewDisLike" DROP CONSTRAINT "UserReviewDisLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserReviewLike" DROP CONSTRAINT "UserReviewLike_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "UserReviewLike" DROP CONSTRAINT "UserReviewLike_userId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "dislikesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "UserReviewDisLike";

-- DropTable
DROP TABLE "UserReviewLike";

-- CreateTable
CREATE TABLE "UserReviewOpinion" (
    "userId" TEXT NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "opinion" "Opinion" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "UserReviewOpinion_pkey" PRIMARY KEY ("userId","reviewId")
);

-- AddForeignKey
ALTER TABLE "UserReviewOpinion" ADD CONSTRAINT "UserReviewOpinion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReviewOpinion" ADD CONSTRAINT "UserReviewOpinion_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
