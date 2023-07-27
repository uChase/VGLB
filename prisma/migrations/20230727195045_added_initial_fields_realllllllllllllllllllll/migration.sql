-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "favGames" SET DEFAULT ARRAY['empty', 'empty', 'empty', 'empty', 'empty']::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "border" TEXT DEFAULT '';
