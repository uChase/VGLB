-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "reviewSpread" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]::INTEGER[];
