/*
  Warnings:

  - You are about to drop the column `postType` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `textId` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postType",
DROP COLUMN "textId",
ADD COLUMN     "listId" INTEGER,
ADD COLUMN     "replyId" INTEGER,
ADD COLUMN     "revCommentId" INTEGER,
ADD COLUMN     "revId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_revId_fkey" FOREIGN KEY ("revId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_revCommentId_fkey" FOREIGN KEY ("revCommentId") REFERENCES "ReviewComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
