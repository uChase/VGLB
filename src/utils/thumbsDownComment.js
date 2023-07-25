"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";
import getIsCommentLiked from "./getIsCommentLiked";

export default async function thumbsDownComment(commentId, uId, revid) {
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
          authorId: uId,
          id: commentId,
        },
      },
      data: {
        totalDislikes: { increment: 1 },
      },
    });
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
          authorId: uId,
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
