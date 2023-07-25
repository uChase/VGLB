-- DropForeignKey
ALTER TABLE "CommentOpinion" DROP CONSTRAINT "CommentOpinion_reviewCommentId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyOpinion" DROP CONSTRAINT "ReplyOpinion_replyId_fkey";

-- DropForeignKey
ALTER TABLE "Replys" DROP CONSTRAINT "Replys_reviewCommentId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewComment" DROP CONSTRAINT "ReviewComment_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "UserReviewOpinion" DROP CONSTRAINT "UserReviewOpinion_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replys" ADD CONSTRAINT "Replys_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyOpinion" ADD CONSTRAINT "ReplyOpinion_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOpinion" ADD CONSTRAINT "CommentOpinion_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "ReviewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReviewOpinion" ADD CONSTRAINT "UserReviewOpinion_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
