"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";

export default async function getIsLiked(revId, uId, liked = "NONE") {
  const data = await prisma.userReviewOpinion.upsert({
    where: {
      userId_reviewId: {
        userId: uId,
        reviewId: revId,
      },
    },
    update: {},
    create: {
      userId: uId,
      reviewId: revId,
      opinion: Opinion.NONE,
    },
  });

  return data;
}
