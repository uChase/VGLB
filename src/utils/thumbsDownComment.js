"use server";

import prisma from "@/db";
import { Prisma, Opinion, PostType, NotifType } from "@prisma/client";
import getIsCommentLiked from "./getIsCommentLiked";
import { sendNotification } from "./notificationUtils";

export default async function thumbsDownComment(
  commentId,
  uId,
  revid,
  authorId,
  sendUsername
) {
  const revId = parseInt(revid);
  const isLiked = await getIsCommentLiked(commentId, uId);
  if (isLiked.opinion === Opinion.NONE) {
    const data = await prisma.commentOpinion.upsert({
      where: {
        userId_reviewCommentId: {
          userId: uId,
          reviewCommentId: commentId,
        },
      },
      update: {
        opinion: Opinion.DISLIKE,
      },
      create: {
        userId: uId,
        reviewCommentId: commentId,
        opinion: Opinion.NONE,
      },
    });
    const comment = await prisma.reviewComment.update({
      where: {
        reviewId_authorId_id: {
          reviewId: revId,
          authorId: authorId,
          id: commentId,
        },
      },
      data: {
        totalDislikes: { increment: 1 },
      },
    });
    if (authorId != uId) {
      await sendNotification(
        authorId,
        sendUsername,
        NotifType.DISLIKE,
        PostType.COMMENT,
        commentId
      );
    }
  } else if (isLiked.opinion === Opinion.DISLIKE) {
    return;
  } else {
    const data = await prisma.commentOpinion.upsert({
      where: {
        userId_reviewCommentId: {
          userId: uId,
          reviewCommentId: commentId,
        },
      },
      update: {
        opinion: Opinion.DISLIKE,
      },
      create: {
        userId: uId,
        reviewCommentId: commentId,
        opinion: Opinion.NONE,
      },
    });
    const comment = await prisma.reviewComment.update({
      where: {
        reviewId_authorId_id: {
          reviewId: revId,
          authorId: authorId,
          id: commentId,
        },
      },
      data: {
        totalLikes: { decrement: 1 },
        totalDislikes: { increment: 1 },
      },
    });
  }
}
