"use server";

import prisma from "@/db";
import getIsLiked from "./getIsLiked";
import { Prisma, Opinion } from "@prisma/client";
export default async function thumbsUp(revId, uId) {
  const isLiked = await getIsLiked(revId, uId);
  if (isLiked.opinion === Opinion.NONE) {
    const data = await prisma.userReviewOpinion.upsert({
      where: {
        userId_reviewId: {
          userId: uId,
          reviewId: revId,
        },
      },
      update: {
        opinion: Opinion.LIKE,
      },
      create: {
        userId: uId,
        reviewId: revId,
        opinion: Opinion.NONE,
      },
    });
    const review = await prisma.review.update({
      where: {
        id: revId,
      },
      data: {
        likesCount: { increment: 1 },
      },
    });
  } else if (isLiked.opinion === Opinion.LIKE) {
    return;
  } else {
    const data = await prisma.userReviewOpinion.upsert({
      where: {
        userId_reviewId: {
          userId: uId,
          reviewId: revId,
        },
      },
      update: {
        opinion: Opinion.LIKE,
      },
      create: {
        userId: uId,
        reviewId: revId,
        opinion: Opinion.NONE,
      },
    });
    const review = await prisma.review.update({
      where: {
        id: revId,
      },
      data: {
        likesCount: { increment: 1 },
        dislikesCount: { decrement: 1 },
      },
    });
  }
}
