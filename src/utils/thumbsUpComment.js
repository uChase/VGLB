"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";
import getIsCommentLiked from "./getIsCommentLiked";
export default async function thumbsUpComment(commentId, uId, revid) {
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
        opinion: Opinion.LIKE,
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
        totalLikes: { increment: 1 },
      },
    });
  } else if (isLiked.opinion === Opinion.LIKE) {
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
        opinion: Opinion.LIKE,
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
        totalLikes: { increment: 1 },
        totalDislikes: { decrement: 1 },
      },
    });
  }
}
