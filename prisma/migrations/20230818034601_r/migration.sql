/*
  Warnings:

  - The values [J] on the enum `NotifType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotifType_new" AS ENUM ('LIKE', 'DISLIKE', 'FOLLOW', 'COMMENT', 'REPLY');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotifType_new" USING ("type"::text::"NotifType_new");
ALTER TYPE "NotifType" RENAME TO "NotifType_old";
ALTER TYPE "NotifType_new" RENAME TO "NotifType";
DROP TYPE "NotifType_old";
COMMIT;
