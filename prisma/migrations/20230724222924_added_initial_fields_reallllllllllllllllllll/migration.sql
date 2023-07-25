-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewSpread" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]::INTEGER[];
