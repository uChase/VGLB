"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";

export default async function getIsReplyLiked(replyId, uId) {
  if (!uId) {
    return false;
  }

  const data = await prisma.replyOpinion.findUnique({
    where: {
      userId_replyId: {
        userId: uId,
        replyId: replyId,
      },
    },
  });

  return data;
}
