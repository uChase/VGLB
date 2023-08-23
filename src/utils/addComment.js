"use server";

import prisma from "@/db";
import { Prisma, Opinion, PostType, NotifType } from "@prisma/client";
import { sendNotification } from "./notificationUtils";

export default async function addComment(
  userId,
  reviewId,
  content,
  ratio,
  authorId,
  sendUsername,
  notifEnable
) {
  const comment = await prisma.reviewComment.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      review: {
        connect: {
          id: reviewId,
        },
      },
      content: content,
      isRatio: ratio,
    },
  });
  if (notifEnable && userId != authorId) {
    await sendNotification(
      authorId,
      sendUsername,
      NotifType.COMMENT,
      PostType.REVIEW,
      reviewId
    );
  }
  return comment;
}
