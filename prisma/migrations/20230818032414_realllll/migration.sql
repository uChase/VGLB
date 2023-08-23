-- AlterTable
ALTER TABLE "List" ADD COLUMN     "notifEnable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Replys" ADD COLUMN     "notifEnable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ReviewComment" ADD COLUMN     "notifEnable" BOOLEAN NOT NULL DEFAULT true;
