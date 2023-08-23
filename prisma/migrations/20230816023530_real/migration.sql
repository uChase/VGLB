-- AlterTable
ALTER TABLE "List" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ListOpinion" (
    "userId" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,
    "opinion" "Opinion" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "ListOpinion_pkey" PRIMARY KEY ("userId","listId")
);

-- AddForeignKey
ALTER TABLE "ListOpinion" ADD CONSTRAINT "ListOpinion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListOpinion" ADD CONSTRAINT "ListOpinion_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
