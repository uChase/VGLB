"use server";

import prisma from "@/db";
import { Prisma, Opinion } from "@prisma/client";
import getIsReplyLiked from "./getIsReplyLiked";

export async function thumbsDownReply(replyId, uId) {
  const isLiked = await getIsReplyLiked(replyId, uId);
  if (isLiked?.opinion === Opinion.NONE || !isLiked?.opinion) {
    const data = await prisma.replyOpinion.upsert({
      where: {
        userId_replyId: {
          userId: uId,
          replyId: replyId,
        },
      },
      update: {
        opinion: Opinion.DISLIKE,
      },
      create: {
        userId: uId,
        replyId: replyId,
        opinion: Opinion.DISLIKE,
      },
    });
    const reply = await prisma.replys.update({
      where: {
        id: replyId,
      },
      data: {
        totalDislikes: { increment: 1 },
      },
    });
  } else if (isLiked.opinion === Opinion.DISLIKE) {
    return;
  } else {
    const data = await prisma.replyOpinion.upsert({
      where: {
        userId_replyId: {
          userId: uId,
          replyId: replyId,
        },
      },
      update: {
        opinion: Opinion.DISLIKE,
      },
      create: {
        userId: uId,
        replyId: replyId,
        opinion: Opinion.NONE,
      },
    });
    const reply = await prisma.replys.update({
      where: {
        id: replyId,
      },
      data: {
        totalLikes: { decrement: 1 },
        totalDislikes: { increment: 1 },
      },
    });
  }
}

export async function thumbsUpReply(replyId, uId) {
  const isLiked = await getIsReplyLiked(replyId, uId);
  if (isLiked?.opinion === Opinion.NONE || !isLiked?.opinion) {
    const data = await prisma.replyOpinion.upsert({
      where: {
        userId_replyId: {
          userId: uId,
          replyId: replyId,
        },
      },
      update: {
        opinion: Opinion.LIKE,
      },
      create: {
        userId: uId,
        replyId: replyId,
        opinion: Opinion.LIKE,
      },
    });
    const reply = await prisma.replys.update({
      where: {
        id: replyId,
      },
      data: {
        totalLikes: { increment: 1 },
      },
    });
  } else if (isLiked.opinion === Opinion.LIKE) {
    return;
  } else {
    const data = await prisma.replyOpinion.upsert({
      where: {
        userId_replyId: {
          userId: uId,
          replyId: replyId,
        },
      },
      update: {
        opinion: Opinion.LIKE,
      },
      create: {
        userId: uId,
        replyId: replyId,
        opinion: Opinion.NONE,
      },
    });
    const reply = await prisma.replys.update({
      where: {
        id: replyId,
      },
      data: {
        totalLikes: { increment: 1 },
        totalDislikes: { decrement: 1 },
      },
    });
  }
}
