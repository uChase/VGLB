/*
  Warnings:

  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `sender` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "senderId",
ADD COLUMN     "sender" TEXT NOT NULL;
