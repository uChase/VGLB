"use server";

import prisma from "@/db";
import getIsLiked from "./getIsLiked";
import { Prisma, Opinion, PostType, NotifType } from "@prisma/client";
import { sendNotification } from "./notificationUtils";
export default async function thumbsDown(
  revId,
  uId,
  authorId,
  sendUsername,
  notifEnable
) {
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
        opinion: Opinion.DISLIKE,
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
        dislikesCount: { increment: 1 },
      },
    });
    if (notifEnable && authorId != uId) {
      await sendNotification(
        authorId,
        sendUsername,
        NotifType.DISLIKE,
        PostType.REVIEW,
        revId
      );
    }
  } else if (isLiked.opinion === Opinion.DISLIKE) {
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
        opinion: Opinion.DISLIKE,
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
        likesCount: { decrement: 1 },
        dislikesCount: { increment: 1 },
      },
    });
  }
}
