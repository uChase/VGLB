-- CreateTable
CREATE TABLE "UserReviewDisLike" (
    "userId" TEXT NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "UserReviewDisLike_pkey" PRIMARY KEY ("userId","reviewId")
);

-- AddForeignKey
ALTER TABLE "UserReviewDisLike" ADD CONSTRAINT "UserReviewDisLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReviewDisLike" ADD CONSTRAINT "UserReviewDisLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
