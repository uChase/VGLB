-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('LIKE', 'DISLIKE', 'FOLLOW', 'COMMENT', 'REPLY');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('LIST', 'REVIEW', 'COMMENT', 'REPLY');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "notifEnable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifEnable" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "NotifType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postType" "PostType",
    "textId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
