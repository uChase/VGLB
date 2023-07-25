"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";

export default async function getIsCommentLiked(
  commentId,
  uId,
  liked = "NONE"
) {
  if (!uId) {
    return false;
  }
  const data = await prisma.commentOpinion.upsert({
    where: {
      userId_reviewCommentId: {
        userId: uId,
        reviewCommentId: commentId,
      },
    },
    update: {},
    create: {
      userId: uId,
      reviewCommentId: commentId,
      opinion: Opinion.NONE,
    },
  });

  return data;
}
